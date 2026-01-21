import { Room, Player, CardValue } from '@/types/poker';
import { CardDeck } from './CardDeck';
import { PlayerList } from './PlayerList';
import { GameControls } from './GameControls';
import { Button } from '@/components/ui/button';
import { LogOut, Spade } from 'lucide-react';

interface GameRoomProps {
  room: Room;
  currentPlayer: Player;
  onVote: (value: CardValue) => void;
  onReveal: () => void;
  onReset: () => void;
  onAddDemoPlayers: () => void;
  onLeave: () => void;
  average: number | null;
}

export const GameRoom = ({
  room,
  currentPlayer,
  onVote,
  onReveal,
  onReset,
  onAddDemoPlayers,
  onLeave,
  average,
}: GameRoomProps) => {
  const votedCount = room.players.filter(p => p.hasVoted && p.role !== 'spectator').length;
  const totalPlayers = room.players.filter(p => p.role !== 'spectator').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Spade className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">{room.name}</h1>
              <p className="text-sm text-muted-foreground">Round {room.currentRound}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLeave} className="gap-2">
            <LogOut className="w-4 h-4" />
            Leave
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Players */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <PlayerList
              players={room.players}
              isRevealed={room.isRevealed}
              currentPlayerId={currentPlayer.id}
            />
          </div>

          {/* Center Column - Card Deck */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="space-y-6">
              {/* Status Banner */}
              <div className="glass-card p-4 text-center">
                {room.isRevealed ? (
                  <p className="text-lg font-medium text-primary">
                    Cards Revealed! 🎉
                  </p>
                ) : currentPlayer.hasVoted ? (
                  <p className="text-lg font-medium text-muted-foreground">
                    Waiting for others to vote...
                  </p>
                ) : (
                  <p className="text-lg font-medium">
                    Pick your estimate
                  </p>
                )}
              </div>

              {/* Card Deck */}
              {currentPlayer.role !== 'spectator' && (
                <CardDeck
                  selectedValue={currentPlayer.vote}
                  onSelect={onVote}
                  disabled={room.isRevealed}
                />
              )}
            </div>
          </div>

          {/* Right Column - Controls */}
          <div className="lg:col-span-1 order-3">
            <GameControls
              isHost={currentPlayer.role === 'host'}
              isRevealed={room.isRevealed}
              roomId={room.id}
              average={average}
              votedCount={votedCount}
              totalPlayers={totalPlayers}
              onReveal={onReveal}
              onReset={onReset}
              onAddDemoPlayers={onAddDemoPlayers}
            />
          </div>
        </div>
      </main>
    </div>
  );
};
