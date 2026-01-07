"use client";

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { getSocket } from "./socket";

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(getSocket());
  }, []);

  return socket;
}
