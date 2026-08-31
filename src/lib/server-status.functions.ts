import { createServerFn } from "@tanstack/react-start";

export type ServerStatus = {
  online: boolean;
  players: number;
  max: number;
};

export const getServerStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ServerStatus> => {
    try {
      const res = await fetch(
        "https://api.mcstatus.io/v2/status/java/bluecow.ice.fo",
        { headers: { accept: "application/json" } },
      );
      if (!res.ok) return { online: false, players: 0, max: 0 };
      const data = (await res.json()) as {
        online?: boolean;
        players?: { online?: number; max?: number };
      };
      return {
        online: Boolean(data.online),
        players: data.players?.online ?? 0,
        max: data.players?.max ?? 0,
      };
    } catch {
      return { online: false, players: 0, max: 0 };
    }
  },
);
