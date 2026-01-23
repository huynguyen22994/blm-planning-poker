import { useState, useCallback } from "react";
import { Room, Player, CardValue, PlayerRole } from "@/types/poker";
import api from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { storage } from "../lib/storage";
import { socket } from "../lib/socket";

const generateId = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const usePokerRoom = () => {
  const oldRoom: string = storage.get("room");
  const oldRoomObject: Room = oldRoom ? JSON.parse(oldRoom) : null;
  const oldCurrentPlayer: string = storage.get("current-player");
  const oldCurrentPlayerObject: Player = oldCurrentPlayer
    ? JSON.parse(oldCurrentPlayer)
    : null;

  const [room, setRoom] = useState<Room | null>(oldRoomObject ?? null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(
    oldCurrentPlayerObject ?? null,
  );

  const navigate = useNavigate();

  const createRoom = useCallback(
    async (playerName: string, roomName: string, roomId?: string) => {
      const result = await api.post("/api/create-room", {
        username: playerName,
        roomName: roomName,
        roomId: roomId,
      });

      if (!result) {
        console.log("Create fail");
        return;
      }

      const host: Player = result.data?.["players"][0] ?? null;
      const newRoom: Room = result.data;

      setRoom(newRoom);
      setCurrentPlayer(host);

      storage.set("room", JSON.stringify(newRoom));
      storage.set("current-player", JSON.stringify(host));

      socket.emit("join-room", {
        roomId: newRoom?.id,
        player: host,
      });
      navigate(`/?room-id=${newRoom?.id}`);
      return newRoom?.id;
    },
    [],
  );

  const joinRoom = useCallback(
    async (roomId: string, playerName: string, role: PlayerRole = "player") => {
      const result = await api.post("/api/join-room", {
        username: playerName,
        roomId: roomId,
      });

      if (!result) {
        console.log("Join fail");
        return;
      }

      const newRoom: Room = result.data;
      const players: Player[] = result.data?.["players"] ?? [];
      const player: Player = players.find((item) => item.name === playerName);

      setRoom(newRoom);
      setCurrentPlayer(player);

      storage.set("room", JSON.stringify(newRoom));
      storage.set("current-player", JSON.stringify(player));

      socket.emit("join-room", {
        roomId: newRoom?.id,
        player: player,
      });
    },
    [],
  );

  const vote = useCallback(
    (value: CardValue) => {
      if (!room || !currentPlayer) return;

      setRoom((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          players: prev.players.map((p) =>
            p.id === currentPlayer.id
              ? { ...p, vote: value, hasVoted: true }
              : p,
          ),
        };
      });

      setCurrentPlayer((prev) => {
        if (!prev) return prev;
        return { ...prev, vote: value, hasVoted: true };
      });
    },
    [room, currentPlayer],
  );

  const reveal = useCallback(() => {
    if (!room || currentPlayer?.role !== "host") return;
    setRoom((prev) => (prev ? { ...prev, isRevealed: true } : prev));
  }, [room, currentPlayer]);

  const reset = useCallback(() => {
    if (!room || currentPlayer?.role !== "host") return;
    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        isRevealed: false,
        currentRound: prev.currentRound + 1,
        players: prev.players.map((p) => ({
          ...p,
          vote: null,
          hasVoted: false,
        })),
      };
    });
    setCurrentPlayer((prev) =>
      prev ? { ...prev, vote: null, hasVoted: false } : prev,
    );
  }, [room, currentPlayer]);

  const addDemoPlayers = useCallback(() => {
    if (!room) return;

    const demoPlayers: Player[] = [
      { id: "demo1", name: "Alice", role: "player", vote: "5", hasVoted: true },
      { id: "demo2", name: "Bob", role: "player", vote: "8", hasVoted: true },
      {
        id: "demo3",
        name: "Charlie",
        role: "player",
        vote: "5",
        hasVoted: true,
      },
      {
        id: "demo4",
        name: "Diana",
        role: "spectator",
        vote: null,
        hasVoted: false,
      },
    ];

    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: [...prev.players, ...demoPlayers],
      };
    });
  }, [room]);

  const calculateAverage = useCallback(() => {
    if (!room) return null;

    const numericVotes = room.players
      .filter((p) => p.vote && !["?", "☕"].includes(p.vote))
      .map((p) => parseInt(p.vote!, 10));

    if (numericVotes.length === 0) return null;

    const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    return Math.round(avg * 10) / 10;
  }, [room]);

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setCurrentPlayer(null);
    storage.remove("room");
    storage.remove("current-player");
  }, []);

  const verifyRoom = useCallback(async (roomId: string): Promise<Room> => {
    const result = await api.post("/api/verify-room", {
      roomId: roomId ?? "",
    });

    if (!result) {
      leaveRoom();
      return null;
    }
    const room: Room = result.data;
    storage.set("room", JSON.stringify(room));
    return room;
  }, []);

  const verifyPlayer = useCallback(
    async (roomId: string, playerId: string): Promise<Player> => {
      const result = await api.post("/api/verify-player", {
        userId: playerId,
        roomId: roomId,
      });

      if (!result) {
        storage.remove("current-player");
        return null;
      }
      const player: Player = result.data;
      storage.set("current-player", JSON.stringify(player));
      return player;
    },
    [],
  );

  return {
    room,
    currentPlayer,
    setRoom,
    createRoom,
    joinRoom,
    vote,
    reveal,
    reset,
    addDemoPlayers,
    calculateAverage,
    leaveRoom,
    verifyRoom,
    verifyPlayer,
  };
};
