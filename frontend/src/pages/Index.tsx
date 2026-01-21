import { usePokerRoom } from '@/hooks/usePokerRoom';
import { LobbyForm } from '@/components/poker/LobbyForm';
import { GameRoom } from '@/components/poker/GameRoom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // use for other host
// const socket = io(); // use for same host

socket.on('connect', () => {
  console.log('connected:', socket.id);
});

socket.emit('ping', { hello: 'world' });

socket.on('pong', (data) => {
  console.log('pong:', data);
});

const Index = () => {
  const {
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
  } = usePokerRoom();

  // Show lobby if not in a room
  if (!room || !currentPlayer) {
    return (
      <LobbyForm
        onCreateRoom={createRoom}
        onJoinRoom={joinRoom}
      />
    );
  }

  // Show game room
  return (
    <GameRoom
      room={room}
      currentPlayer={currentPlayer}
      onVote={vote}
      onReveal={reveal}
      onReset={reset}
      onAddDemoPlayers={addDemoPlayers}
      onLeave={leaveRoom}
      average={calculateAverage()}
    />
  );
};

export default Index;
