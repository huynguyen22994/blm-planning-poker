import { usePokerRoom } from "@/hooks/usePokerRoom";
import { LobbyForm } from "@/components/poker/LobbyForm";
import { GameRoom } from "@/components/poker/GameRoom";

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
    return <LobbyForm onCreateRoom={createRoom} onJoinRoom={joinRoom} />;
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
