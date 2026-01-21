import { useState, useCallback } from 'react';
import { Room, Player, CardValue, PlayerRole } from '@/types/poker';

const generateId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

export const usePokerRoom = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const createRoom = useCallback((playerName: string, roomName: string) => {
    const playerId = generateId();
    const roomId = generateId();
    
    const host: Player = {
      id: playerId,
      name: playerName,
      role: 'host',
      vote: null,
      hasVoted: false,
    };

    const newRoom: Room = {
      id: roomId,
      name: roomName,
      hostId: playerId,
      players: [host],
      isRevealed: false,
      currentRound: 1,
    };

    setRoom(newRoom);
    setCurrentPlayer(host);
    return roomId;
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string, role: PlayerRole = 'player') => {
    const playerId = generateId();
    
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      role,
      vote: null,
      hasVoted: false,
    };

    // For demo purposes, create a mock room if joining
    const mockRoom: Room = {
      id: roomId,
      name: `Room ${roomId}`,
      hostId: playerId,
      players: [newPlayer],
      isRevealed: false,
      currentRound: 1,
    };

    setRoom(mockRoom);
    setCurrentPlayer(newPlayer);
  }, []);

  const vote = useCallback((value: CardValue) => {
    if (!room || !currentPlayer) return;

    setRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.map(p =>
          p.id === currentPlayer.id
            ? { ...p, vote: value, hasVoted: true }
            : p
        ),
      };
    });

    setCurrentPlayer(prev => {
      if (!prev) return prev;
      return { ...prev, vote: value, hasVoted: true };
    });
  }, [room, currentPlayer]);

  const reveal = useCallback(() => {
    if (!room || currentPlayer?.role !== 'host') return;
    setRoom(prev => prev ? { ...prev, isRevealed: true } : prev);
  }, [room, currentPlayer]);

  const reset = useCallback(() => {
    if (!room || currentPlayer?.role !== 'host') return;
    setRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        isRevealed: false,
        currentRound: prev.currentRound + 1,
        players: prev.players.map(p => ({
          ...p,
          vote: null,
          hasVoted: false,
        })),
      };
    });
    setCurrentPlayer(prev => prev ? { ...prev, vote: null, hasVoted: false } : prev);
  }, [room, currentPlayer]);

  const addDemoPlayers = useCallback(() => {
    if (!room) return;
    
    const demoPlayers: Player[] = [
      { id: 'demo1', name: 'Alice', role: 'player', vote: '5', hasVoted: true },
      { id: 'demo2', name: 'Bob', role: 'player', vote: '8', hasVoted: true },
      { id: 'demo3', name: 'Charlie', role: 'player', vote: '5', hasVoted: true },
      { id: 'demo4', name: 'Diana', role: 'spectator', vote: null, hasVoted: false },
    ];

    setRoom(prev => {
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
      .filter(p => p.vote && !['?', '☕'].includes(p.vote))
      .map(p => parseInt(p.vote!, 10));
    
    if (numericVotes.length === 0) return null;
    
    const avg = numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length;
    return Math.round(avg * 10) / 10;
  }, [room]);

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setCurrentPlayer(null);
  }, []);

  return {
    room,
    currentPlayer,
    createRoom,
    joinRoom,
    vote,
    reveal,
    reset,
    addDemoPlayers,
    calculateAverage,
    leaveRoom,
  };
};
