import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getServerStatus } from "@/lib/server-status.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blue Cow SMP — Minecraft Survival Server" },
      {
        name: "description",
        content:
          "Join Blue Cow SMP, a friendly blue-themed survival Minecraft server. 128+ players online, no pay-to-win, fresh seasons, and a community that remembers your name.",
      },
      {
        property: "og:title",
        content: "Blue Cow SMP — Minecraft Survival Server",
      },
      {
        property: "og:description",
        content:
          "Join Blue Cow SMP, a friendly blue-themed survival Minecraft server. 128+ players online, no pay-to-win, fresh seasons, and a community that remembers your name.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SERVER_IP = "bluecow.ice.fo";
const DISCORD_URL = "https://discord.gg/nkCMqKrzZa";

function useServerStatus() {
  const fetchStatus = useServerFn(getServerStatus);
  return useQuery({
    queryKey: ["server-status"],
    queryFn: () => fetchStatus(),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}


function CopyIpButton() {
const [copied, setCopied] = useState(false);

  const copyIp = async () => {
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await Promise.race([
          navigator.clipboard.writeText(SERVER_IP),
          new Promise((_, reject) =>
            window.setTimeout(
              () => reject(new Error("clipboard timeout")),
              800,
            ),
          ),
        ]);
        copied = true;
      }
    } catch {
      copied = false;
    }
    if (!copied) {
      const textarea = document.createElement("textarea");
      textarea.value = SERVER_IP;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copyIp}
      className="flex items-center gap-1.5 rounded-md bg-glow-500/15 px-3 py-1.5 text-xs font-semibold text-glow-300 ring-1 ring-glow-400/50 transition-colors hover:bg-glow-500/25"
    >
      <span className="font-pixel text-[10px]">⧉</span>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function StatusPill() {
  const { data, isPending } = useServerStatus();
  const online = data?.online ?? false;
  const dot = online ? "bg-glow-400" : "bg-gold-400";

  return (
    <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full bg-ocean-900/80 px-4 py-1.5 ring-1 ring-glow-500/25 sm:gap-3">
      <span className="relative flex size-2.5">
        {online && (
          <span
            className={`bc-glow absolute inline-flex size-full rounded-full ${dot} opacity-75`}
          />
        )}
        <span
          className={`relative inline-flex size-2.5 rounded-full ${dot}`}
        />
      </span>
      <span className="font-mono text-base text-foam-100 sm:text-lg">
        {isPending
          ? "checking players…"
          : `${data?.players ?? 0} / ${data?.max ?? 0} players online`}
      </span>
      <span className="hidden h-4 w-px bg-gold-500/40 sm:block" />
      <span className="font-mono text-base text-glow-300 sm:text-lg">
        {isPending ? "Status: …" : online ? "Status: Online" : "Status: Offline"}
      </span>
    </div>
  );
}

function OnlineNowStat() {
  const { data, isPending } = useServerStatus();
  return (
    <StatCard
      value={isPending ? "…" : String(data?.players ?? 0)}
      label="Online Now"
    />
  );
}


function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-ocean-900 px-5 py-5 text-center ring-1 ring-gold-500/15">
      <p className="font-mono text-3xl text-glow-300">{value}</p>
      <p className="mt-1 font-pixel text-[10px] uppercase tracking-widest text-foam-400">
        {label}
      </p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bc-lift rounded-2xl bg-ocean-800 p-6 ring-1 ring-gold-500/20">
      <span className="grid size-11 place-items-center rounded-lg bg-glow-500/15 font-pixel text-lg text-glow-400 ring-1 ring-glow-500/40">
        {icon}
      </span>
      <h3 className="mt-4 font-display text-lg font-semibold text-foam-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-pretty text-foam-200/80">{children}</p>
    </div>
  );
}

function FaqItem({
  question,
  defaultOpen = false,
  children,
}: {
  question: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-ocean-900 ring-1 ring-gold-500/15">
      <details open={defaultOpen} className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-semibold text-foam-100">
          {question}
          <span className="font-pixel text-gold-300 transition-transform group-open:rotate-90">
            ›
          </span>
        </summary>
        <p className="px-5 pb-4 text-sm text-pretty text-foam-200/80">
          {children}
        </p>
      </details>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-ocean-950 font-body text-foam-100 antialiased selection:bg-glow-500/30 selection:text-white">
      {/* Nav */}
      <header className="relative z-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-5">
            <a href="#top" className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-md bg-ocean-800 font-pixel text-sm text-glow-400 ring-1 ring-gold-400/40">
                BC
              </span>
              <span className="font-display text-sm tracking-[0.25em] text-foam-100">
                BLUE&nbsp;COW&nbsp;SMP
              </span>
            </a>
            <nav className="hidden items-center gap-8 text-sm text-foam-200 md:flex">
              <a href="#why" className="transition-colors hover:text-glow-300">
                Why Play
              </a>
              <a href="#join" className="transition-colors hover:text-glow-300">
                Join
              </a>
              <a href="#rules" className="transition-colors hover:text-glow-300">
                Rules
              </a>
              <a href="#faq" className="transition-colors hover:text-glow-300">
                FAQ
              </a>
            </nav>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-gold-500/10 px-4 py-2 text-sm font-semibold text-gold-300 ring-1 ring-gold-400/50 transition-colors hover:bg-gold-500/20"
            >
              <span className="font-pixel text-xs">◆</span> Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative overflow-hidden border-b border-gold-500/15 border-t border-gold-500/15"
      >
        <div className="bc-orb -left-24 top-10 size-[380px] bg-glow-500/40" />
        <div className="bc-orb bottom-0 right-0 size-[300px] bg-glow-400/30" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
          {/* top ornament */}
          <div className="mb-10 flex items-center justify-center gap-3 text-gold-500/70">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
            <span className="font-pixel text-xs tracking-widest">
              EST. SEASON 04
            </span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>

          <h1 className="font-display text-balance text-5xl font-semibold leading-none text-foam-100 md:text-7xl">
            BLUE COW <span className="text-glow-400">SMP</span>
          </h1>
          <p className="mt-5 font-pixel text-[11px] uppercase tracking-[0.3em] text-gold-300/80 md:text-xs">
            A Trusted Home Survival Server
          </p>
          <p className="mx-auto mt-6 max-w-[42ch] text-pretty text-base text-foam-200/90 md:text-lg">
            A calm, close-knit survival world where the lights stay on and the
            doors stay open. Build, trade, and settle in — no pay-to-win, no
            drama, just good company.
          </p>

          {/* IP pill + copy */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="bc-pulse inline-flex items-center gap-3 rounded-lg bg-ocean-800 px-6 py-4 ring-1 ring-glow-500/40">
              <span className="font-mono text-2xl tracking-wide text-glow-300 md:text-3xl">
                {SERVER_IP}
              </span>
              <CopyIpButton />
            </div>
            <StatusPill />

          </div>

          {/* Discord CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md bg-glow-500 px-5 py-3 text-sm font-semibold text-ocean-950 transition-colors hover:bg-glow-400"
            >
              <span className="font-pixel text-xs">◆</span> Join the Discord
            </a>
            <a
              href="#join"
              className="flex items-center gap-2 rounded-md bg-transparent px-5 py-3 text-sm font-semibold text-foam-100 ring-1 ring-foam-400/30 transition-colors hover:bg-foam-100/5"
            >
              How to join
            </a>
          </div>

          {/* floating pixel blocks */}
          <div className="relative mt-12 flex h-10 items-end justify-center gap-6">
            <span className="bc-float-slow inline-block size-3 rounded-[2px] bg-glow-500/70" />
            <span className="bc-float inline-block size-4 rounded-[2px] bg-gold-400/80" />
            <span className="bc-float-slow inline-block size-2.5 rounded-[2px] bg-glow-300/80" />
            <span className="bc-float inline-block size-5 rounded-[2px] bg-glow-400/60" />
            <span className="bc-float-slow inline-block size-3 rounded-[2px] bg-gold-300/70" />
          </div>

          {/* bottom ornament */}
          <div className="mt-10 flex items-center justify-center gap-3 text-gold-500/70">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/60" />
            <span className="font-pixel text-[10px]">✦ ✦ ✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/60" />
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 gap-3 py-8 md:grid-cols-4">
            <StatCard value="128" label="Online Now" />
            <StatCard value="99.6%" label="Uptime" />
            <StatCard value="04" label="Seasons" />
            <StatCard value="2.1k" label="Members" />
          </div>
        </div>
      </section>

      {/* Why play */}
      <section id="why" className="relative">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-12 text-center">
            <p className="font-pixel text-xs uppercase tracking-[0.3em] text-gold-300/80">
              Why Play
            </p>
            <h2 className="mx-auto mt-3 max-w-[40ch] font-display text-balance text-3xl font-semibold text-foam-100 md:text-4xl">
              A home server built to last
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard icon="⛏" title="Survival SMP">
              Genuine survival with friendly PvP opt-in. Keep your spawn gear,
              lose what you care about.
            </FeatureCard>
            <FeatureCard icon="★" title="Community Events">
              Weekly building contests, treasure hunts, and boss raids run by a
              staff team that shows up.
            </FeatureCard>
            <FeatureCard icon="⚑" title="Land Claims">
              Claim your plot and it stays yours. Grief-proofing is on by
              default, so sleep easy.
            </FeatureCard>
            <FeatureCard icon="↻" title="Seasons & Resets">
              Fresh worlds every few months. Your world-blocks carry over as a
              keepsake each season.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* Join + Rules (two column) */}
      <section
        id="join"
        className="relative border-t border-gold-500/15"
      >
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2">
            {/* Join steps */}
            <div>
              <p className="font-pixel text-xs uppercase tracking-[0.3em] text-gold-300/80">
                How to Join
              </p>
              <h2 className="mt-3 max-w-[30ch] font-display text-balance text-2xl font-semibold text-foam-100 md:text-3xl">
                Three steps to the door
              </h2>
              <ol className="mt-8 space-y-5">
                <li className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-glow-500/15 font-pixel text-sm text-glow-300 ring-1 ring-glow-500/40">
                    1
                  </span>
                  <div>
                    <h3 className="font-semibold text-foam-100">
                      Grab a client
                    </h3>
                    <p className="mt-1 text-sm text-pretty text-foam-200/80">
                      Any Java 1.20+ client works. No mods required to join,
                      though a couple of packs are recommended.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-glow-500/15 font-pixel text-sm text-glow-300 ring-1 ring-glow-500/40">
                    2
                  </span>
                  <div>
                    <h3 className="font-semibold text-foam-100">
                      Add the server
                    </h3>
                    <p className="mt-1 text-sm text-pretty text-foam-200/80">
                      In Multiplayer, click Add Server and paste{" "}
                      <span className="font-mono text-lg text-glow-300">
                        {SERVER_IP}
                      </span>
                      .
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-glow-500/15 font-pixel text-sm text-glow-300 ring-1 ring-glow-500/40">
                    3
                  </span>
                  <div>
                    <h3 className="font-semibold text-foam-100">
                      Hop in &amp; say hi
                    </h3>
                    <p className="mt-1 text-sm text-pretty text-foam-200/80">
                      Spawn in, read the board, and post a hello in Discord so
                      we know your name.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
            {/* Rules */}
            <div id="rules">
              <p className="font-pixel text-xs uppercase tracking-[0.3em] text-gold-300/80">
                The Rules
              </p>
              <h2 className="mt-3 max-w-[30ch] font-display text-balance text-2xl font-semibold text-foam-100 md:text-3xl">
                House standards
              </h2>
              <div className="mt-8 rounded-2xl bg-ocean-900 p-6 ring-1 ring-gold-500/20">
                <ul className="divide-y divide-gold-500/15">
                  <li className="flex gap-3 py-3">
                    <span className="shrink-0 font-pixel text-xs text-gold-300">
                      01
                    </span>
                    <span className="text-sm text-pretty text-foam-200/85">
                      Respect every player. No harassment, hate, or real-world
                      threats — zero tolerance.
                    </span>
                  </li>
                  <li className="flex gap-3 py-3">
                    <span className="shrink-0 font-pixel text-xs text-gold-300">
                      02
                    </span>
                    <span className="text-sm text-pretty text-foam-200/85">
                      No griefing inside claimed land. Unclaimed areas are fair
                      game, but be a good sportsman.
                    </span>
                  </li>
                  <li className="flex gap-3 py-3">
                    <span className="shrink-0 font-pixel text-xs text-gold-300">
                      03
                    </span>
                    <span className="text-sm text-pretty text-foam-200/85">
                      No lag machines, x-ray, or any form of mod abuse. Keep
                      the world running clean.
                    </span>
                  </li>
                  <li className="flex gap-3 py-3">
                    <span className="shrink-0 font-pixel text-xs text-gold-300">
                      04
                    </span>
                    <span className="text-sm text-pretty text-foam-200/85">
                      No scamming in the trading hubs. If a deal feels off,
                      walk away and report it.
                    </span>
                  </li>
                  <li className="flex gap-3 py-3">
                    <span className="shrink-0 font-pixel text-xs text-gold-300">
                      05
                    </span>
                    <span className="text-sm text-pretty text-foam-200/85">
                      English in public channels. Keep the chat welcoming for
                      everyone who joins.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative border-t border-gold-500/15">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="mb-10 text-center">
            <p className="font-pixel text-xs uppercase tracking-[0.3em] text-gold-300/80">
              FAQ
            </p>
            <h2 className="mt-3 font-display text-balance text-3xl font-semibold text-foam-100 md:text-4xl">
              Common questions
            </h2>
          </div>
          <div className="space-y-3">
            <FaqItem question="Is there a whitelist?" defaultOpen>
              Yes, we keep a soft whitelist to stay friendly. Apply on Discord
              with a quick intro and we review within a day or two.
            </FaqItem>
            <FaqItem question="What version do I need?">
              Java Edition 1.20 and up. We run vanilla first, so if you can
              play singleplayer, you can play here.
            </FaqItem>
            <FaqItem question="Do I lose everything on a reset?">
              Your land and builds reset, but you keep a season chest of chosen
              blocks plus your rank and cosmetics. Nothing is truly gone.
            </FaqItem>
            <FaqItem question="Is it pay-to-win?">
              Never. All ranks are cosmetic or quality-of-life. You can earn
              every rank by simply playing and hanging around.
            </FaqItem>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="discord"
        className="relative overflow-hidden border-t border-gold-500/20 bg-ocean-900/60"
      >
        <div className="bc-orb -bottom-20 left-1/2 size-[260px] -translate-x-1/2 bg-glow-500/20" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-md bg-ocean-800 font-pixel text-sm text-glow-400 ring-1 ring-gold-400/40">
                  BC
                </span>
                <span className="font-display text-sm tracking-[0.25em] text-foam-100">
                  BLUE&nbsp;COW&nbsp;SMP
                </span>
              </div>
              <p className="mt-4 text-sm text-pretty text-foam-200/70">
                A cozy survival home under the night sky. Come as you are, stay
                a while.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md bg-glow-500 px-5 py-3 text-sm font-semibold text-ocean-950 transition-colors hover:bg-glow-400"
                >
                  <span className="font-pixel text-xs">◆</span> Discord
                </a>
                <a
                  href="#top"
                  className="flex items-center gap-2 rounded-md bg-transparent px-5 py-3 text-sm font-semibold text-gold-300 ring-1 ring-gold-400/40 transition-colors hover:bg-gold-500/10"
                >
                  <span className="bc-glow size-2 rounded-full bg-glow-400" />
                  Status
                </a>
              </div>
              <p className="font-mono text-lg text-foam-400">{SERVER_IP}</p>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gold-500/15 pt-6 text-xs text-foam-400/70 md:flex-row">
            <span>© 2026 Blue Cow SMP. Fan-made community project.</span>
            <span className="font-pixel tracking-widest text-gold-300/60">
              ✦ ✦ ✦
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}