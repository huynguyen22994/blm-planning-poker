import { usePokerRoom } from "@/hooks/usePokerRoom";
import { LobbyForm } from "@/components/poker/LobbyForm";
import { GameRoom } from "@/components/poker/GameRoom";
import { LobbyDialog } from "@/components/poker/DialogLobbyForm";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { socket } from "@/lib/socket";

const Index = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room-id");

  const {
    room,
    setRoom,
    currentPlayer,
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
  } = usePokerRoom();

  useEffect(() => {
    socket.on("user-joined", (data) => {
      if (data) {
        verifyRoom(roomId).then((room) => {
          if (room) {
            setRoom(room);
          }
        });
      }
    });

    return () => {
      socket.off("user-joined");
    };
  }, [roomId]);

  // Show lobby if not in a room
  if ((!room || !currentPlayer) && !roomId) {
    return <LobbyForm onCreateRoom={createRoom} onJoinRoom={joinRoom} />;
  }

  if (!room && !currentPlayer) {
    // Hiện popup đặt tên room và người chơi -> set thành host room
    console.log("1");
    verifyRoom(roomId).then((data) => {
      if (data) {
        window.location.reload();
      }
    });
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
    console.log("2");
    verifyRoom(roomId).then((data) => {
      console.log(data);
      if (data) {
      }
    });
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
    console.log("3");
    verifyPlayer(roomId ?? room?.id, currentPlayer.id)
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
