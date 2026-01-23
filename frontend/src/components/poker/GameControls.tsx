import { Button } from "@/components/ui/button";
import { Eye, RotateCcw, Users, Copy, Check } from "lucide-react";
import { useState } from "react";

interface GameControlsProps {
  isHost: boolean;
  isRevealed: boolean;
  roomId: string;
  average: number | null;
  votedCount: number;
  totalPlayers: number;
  onReveal: () => void;
  onReset: () => void;
  onAddDemoPlayers: () => void;
}

export const GameControls = ({
  isHost,
  isRevealed,
  roomId,
  average,
  votedCount,
  totalPlayers,
  onReveal,
  onReset,
  onAddDemoPlayers,
}: GameControlsProps) => {
  const [copied, setCopied] = useState(false);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      {/* Room Info */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Room ID</p>
          <div className="flex items-center gap-2">
            <code className="text-lg font-mono font-bold text-primary">
              {roomId}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={copyRoomId}
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Voted</p>
          <p className="text-lg font-bold">
            {votedCount}/{totalPlayers}
          </p>
        </div>
      </div>

      {/* Average Display */}
      {isRevealed && average !== null && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/30 text-center">
          <p className="text-sm text-muted-foreground mb-1">Average</p>
          <p className="text-4xl font-bold text-primary">{average}</p>
        </div>
      )}

      {/* Host Controls */}
      <div className="flex flex-col gap-3">
        {!isRevealed ? (
          <Button
            onClick={onReveal}
            className="w-full gap-2"
            size="lg"
            disabled={votedCount === 0}
          >
            <Eye className="w-5 h-5" />
            Reveal Cards
          </Button>
        ) : (
          <Button
            onClick={onReset}
            variant="secondary"
            className="w-full gap-2"
            size="lg"
          >
            <RotateCcw className="w-5 h-5" />
            New Round
          </Button>
        )}

        <Button
          onClick={onAddDemoPlayers}
          variant="outline"
          className="w-full gap-2"
          size="sm"
        >
          <Users className="w-4 h-4" />
          Add Demo Players
        </Button>
      </div>
    </div>
  );
};
