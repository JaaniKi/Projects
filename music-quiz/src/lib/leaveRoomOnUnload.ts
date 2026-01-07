"use client";

import type { Socket } from "socket.io-client";

export function attachLeaveOnUnload(socket: Socket, roomId: string) {
  const handler = () => {
    try {
      socket.emit("room:leave", { roomId });
    } catch {}
  };

  // beforeunload = tab close / refresh / full page navigation
  window.addEventListener("beforeunload", handler);

  return () => {
    window.removeEventListener("beforeunload", handler);
  };
}
