import { usePokerRoom } from "@/hooks/usePokerRoom";
import { LobbyForm } from "@/components/poker/LobbyForm";
import { GameRoom } from "@/components/poker/GameRoom";
import { LobbyDialog } from "@/components/poker/DialogLobbyForm";
import { useSearchParams } from "react-router-dom";

const Index = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room-id");

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
  if ((!room || !currentPlayer) && !roomId) {
    return <LobbyForm onCreateRoom={createRoom} onJoinRoom={joinRoom} />;
  }

  if (!room && !currentPlayer) {
    // Hiện popup đặt tên room và người chơi -> set thành host room
    return (
      <LobbyDialog
        roomId={roomId}
        room={room}
        onCreate={createRoom}
        onJoin={joinRoom}
      />
    );
  } else if (room && !currentPlayer) {
    // Hiện popup đặt tên người chơi
    return (
      <LobbyDialog
        roomId={roomId}
        room={room}
        onCreate={createRoom}
        onJoin={joinRoom}
      />
    );
  } else {
    // Verify ID người chơi và set vào localstore
    console.log(roomId);
  }

  // Show game room
  return (
    <GameRoom
      roomId={roomId}
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
