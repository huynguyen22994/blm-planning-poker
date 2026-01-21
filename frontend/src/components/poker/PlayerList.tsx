import { Player } from '@/types/poker';
import { PokerCard } from './PokerCard';
import { User, Crown, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerListProps {
  players: Player[];
  isRevealed: boolean;
  currentPlayerId?: string;
}

export const PlayerList = ({ players, isRevealed, currentPlayerId }: PlayerListProps) => {
  const getRoleIcon = (role: Player['role']) => {
    switch (role) {
      case 'host':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'spectator':
        return <Eye className="w-4 h-4 text-muted-foreground" />;
      default:
        return <User className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Players ({players.length})
      </h3>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-xl',
              'bg-secondary/50 border border-border/30',
              player.id === currentPlayerId && 'ring-2 ring-primary/50'
            )}
          >
            <div className="flex items-center gap-3">
              {getRoleIcon(player.role)}
              <span className="font-medium">
                {player.name}
                {player.id === currentPlayerId && (
                  <span className="text-xs text-muted-foreground ml-2">(You)</span>
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {player.role !== 'spectator' && (
                player.hasVoted ? (
                  <PokerCard
                    value={player.vote || '0'}
                    isOtherPlayer={player.id !== currentPlayerId}
                    isRevealed={isRevealed}
                    hasVoted={player.hasVoted}
                    size="sm"
                  />
                ) : (
                  <div className="w-12 h-16 rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">...</span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
