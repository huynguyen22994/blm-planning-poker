import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LogIn, Spade } from "lucide-react";
import { useState } from "react";
import { Room } from "@/types/poker";

interface ScrumPokerDialogProps {
  roomId: string;
  room: Room;
  onCreate: (playerName: string, roomName: string, roomId?: string) => void;
  onJoin: (playerName: string, roomId: string) => void;
}

export function LobbyDialog({
  roomId,
  room,
  onCreate,
  onJoin,
}: ScrumPokerDialogProps) {
  const hasRoom = room?.id ? true : false;

  const [playerName, setPlayerName] = useState("");
  const [roomName, setRoomName] = useState(room?.name ?? "");

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasRoom) {
      onJoin(roomId, playerName);
    } else {
      onCreate(playerName, roomName, roomId);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="p-0 border-none bg-transparent shadow-none">
        <Card className="w-full max-w-md glass-card border-border/30 relative">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              BLM
            </div>

            <CardTitle className="text-3xl font-bold">Scrum Poker</CardTitle>

            <CardDescription className="text-muted-foreground">
              Estimate stories with your team in real-time
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="join-room" className="w-full">
              <TabsList className="grid w-full grid-cols-1 mb-6">
                <TabsTrigger value="join-room" className="gap-2">
                  Join {room && room.name ? "Room: " + room.name : ""}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="join-room">
                <form onSubmit={handleOnSubmit} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                  {!hasRoom ? (
                    <Input
                      placeholder="Room name"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                    />
                  ) : null}
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    size="lg"
                    disabled={!playerName.trim() || !roomName.trim()}
                  >
                    <Plus className="w-5 h-5" />
                    Join Room
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
