"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSocket } from "../../../lib/useSocket";

import { LobbyShell } from "../../../components/lobby/LobbyShell";
import { LobbyHeader } from "../../../components/lobby/LobbyHeader";
import { JoinCard } from "../../../components/lobby/JoinCard";
import { PlayersList } from "../../../components/lobby/PlayersList";
import { HostSettings } from "../../../components/lobby/HostSettings";

const NAME_KEY = "musicquiz:name";

export default function Lobby() {
    const params = useParams();
    const roomId = Array.isArray((params as any).roomId)
        ? (params as any).roomId[0]
        : (params as any).roomId;

    const socket = useSocket();
    const [state, setState] = useState<any>(null);
    const router = useRouter();

    const [nameInput, setNameInput] = useState(() => {
        if (typeof window === "undefined") return "";
        return localStorage.getItem(NAME_KEY) ?? "";
    });

    const [joinMsg, setJoinMsg] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [nameDirty, setNameDirty] = useState(false);

    const copyInviteLink = useCallback(async () => {
        try {
            const url = window.location.href;
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            const url = window.location.href;
            window.prompt("Copy this link:", url);
        }
    }, []);



    useEffect(() => {
        if (!socket || !roomId) return;

        const onUpdate = (s: any) => {
            setState(s);
            const meInRoom = s?.players?.some((p: any) => p.socketId === socket.id);
            if (meInRoom) setHasJoined(true);
        };

        socket.on("room:update", onUpdate);

        return () => {
            socket.off("room:update", onUpdate);
        };
    }, [socket, roomId]);


    const navigatedRef = useRef(false);

    useEffect(() => {
        if (!state || !roomId) return;
        if (!hasJoined) return;

        if (state.game?.phase === "PLAYING" && !navigatedRef.current) {
            navigatedRef.current = true;
            router.replace(`/play/${roomId}`);
        }

        if (state.game?.phase !== "PLAYING") {
            navigatedRef.current = false;
        }
    }, [state, hasJoined, roomId, router]);

    const joinLobby = useCallback(() => {
        if (!socket || !roomId) return;

        const trimmed = nameInput.trim().slice(0, 24);
        if (!trimmed) {
            setJoinMsg("Name can't be empty");
            setTimeout(() => setJoinMsg(null), 1500);
            return;
        }

        localStorage.setItem(NAME_KEY, trimmed);

        socket.emit("room:join", { roomId, name: trimmed }, (resp: any) => {
            if (resp?.ok) {
                setHasJoined(true);
                setJoinMsg(null);
                if (state?.game?.phase === "PLAYING") router.replace(`/play/${roomId}`);
            } else {
                setJoinMsg(resp?.error ?? "Join failed");
                setTimeout(() => setJoinMsg(null), 1500);
            }
        });
    }, [socket, roomId, nameInput, state, router]);

    useEffect(() => {
        if (!socket || !roomId) return;
        if (!hasJoined) return;

        const onRound = () => {
            setTimeout(() => router.replace(`/play/${roomId}`), 150);
        };

        socket.on("game:round", onRound);

        return () => {
            socket.off("game:round", onRound);
        };
    }, [socket, roomId, hasJoined, router]);

    useEffect(() => {
        if (!socket || !roomId) return;
        if (hasJoined) return;
        if (nameDirty) return;

        const saved =
            (typeof window !== "undefined" ? localStorage.getItem(NAME_KEY) : "") ?? "";
        const trimmedSaved = saved.trim().slice(0, 24);
        if (!trimmedSaved) return;
        if (nameInput.trim() !== trimmedSaved) return;

        socket.emit("room:join", { roomId, name: trimmedSaved }, (resp: any) => {
            if (resp?.ok) {
                setHasJoined(true);
                setJoinMsg(null);
            } else {
                setJoinMsg(resp?.error ?? "Join failed");
            }
        });
    }, [socket, roomId, hasJoined, nameInput, nameDirty]);

    if (!roomId || !socket) {
        return (
            <LobbyShell>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-5 py-4">
                    {!roomId ? "Loading…" : "Connecting…"}
                </div>
            </LobbyShell>
        );
    }

    const leaveToHome = () => {
        socket.emit("room:leave", { roomId }, () => {
            router.replace("/");
        });
    };

    const savedName =
        (typeof window !== "undefined" ? localStorage.getItem(NAME_KEY) : "")?.trim() ??
        "";
    const meInRoom = state?.players?.some((p: any) => p.socketId === socket.id);
    const shouldAskName = !savedName && !hasJoined && !meInRoom;

    if (shouldAskName) {
        return (
            <LobbyShell>
                <JoinCard
                    roomId={roomId}
                    nameInput={nameInput}
                    setNameInput={setNameInput}
                    setNameDirty={setNameDirty}
                    onJoin={joinLobby}
                    joinMsg={joinMsg}
                />
            </LobbyShell>
        );
    }

    if (!state) {
        return (
            <LobbyShell>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 px-5 py-4">
                    Loading…
                </div>
            </LobbyShell>
        );
    }

    const isHost = state.hostSocketId === socket.id;
    const myName =
        state.players?.find((p: any) => p.socketId === socket.id)?.name ??
        nameInput.trim() ??
        "Player";

    const finished = state.game?.phase === "FINISHED";

    // “Playing” -tilassa näytetään odotusnäkymä, mutta ei pakoteta useria minnekään (navigointi hoituu yllä)
    if (state.game?.phase === "PLAYING") {
        return (
            <LobbyShell>
                <LobbyHeader roomId={roomId} onBack={leaveToHome} />
                <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <p className="text-sm text-zinc-300">
                        Your name: <span className="font-semibold text-zinc-50">{myName}</span>
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                        Game is currently in progress. Please wait for the next game.
                    </p>
                </div>

                <PlayersList
                    players={state.players ?? []}
                    mySocketId={socket.id ?? ""}
                    finished={finished}
                    titleOverride="Players"
                    showScores={false}
                />
            </LobbyShell>
        );
    }

    return (
        <LobbyShell>
            <LobbyHeader
                roomId={roomId}
                onInvite={copyInviteLink}
                copied={copied}
                onBack={leaveToHome}
            />

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <p className="text-sm text-zinc-300">
                    You are: <span className="font-semibold text-zinc-50">{myName}</span>
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                    {isHost ? "You are the host." : "Waiting for host to start…"}
                </p>
            </div>

            <PlayersList
                players={state.players ?? []}
                mySocketId={socket.id ?? ""}
                finished={finished}
                showScores={false}
            />

            {isHost && (
                <HostSettings
                    roomId={roomId}
                    state={state}
                    socket={socket}
                    onStart={() => {
                        socket.emit("game:start", { roomId });
                        router.replace(`/play/${roomId}`);
                    }}
                />
            )}
        </LobbyShell>
    );
}
