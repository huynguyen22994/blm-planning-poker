import { cn } from '@/lib/utils';
import { CardValue } from '@/types/poker';

interface PokerCardProps {
  value: CardValue;
  isSelected?: boolean;
  isRevealed?: boolean;
  isOtherPlayer?: boolean;
  hasVoted?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const PokerCard = ({
  value,
  isSelected = false,
  isRevealed = false,
  isOtherPlayer = false,
  hasVoted = false,
  onClick,
  size = 'md',
}: PokerCardProps) => {
  const sizeClasses = {
    sm: 'w-12 h-16 text-lg',
    md: 'w-16 h-24 text-2xl',
    lg: 'w-20 h-28 text-3xl',
  };

  const showValue = !isOtherPlayer || isRevealed;
  const showBack = isOtherPlayer && hasVoted && !isRevealed;

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative cursor-pointer transition-all duration-300 perspective-1000',
        sizeClasses[size],
        onClick && 'hover:scale-110 hover:-translate-y-2'
      )}
    >
      <div
        className={cn(
          'card-flip w-full h-full',
          showBack && 'flipped'
        )}
      >
        {/* Front - Shows value */}
        <div
          className={cn(
            'card-front absolute inset-0 rounded-xl flex items-center justify-center font-bold',
            'border-2 transition-all duration-300',
            'bg-gradient-to-br from-card to-secondary',
            isSelected
              ? 'border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/50'
              : 'border-border/50 hover:border-primary/50',
            value === '☕' && 'text-amber-400',
            value === '?' && 'text-muted-foreground'
          )}
        >
          {showValue && value}
        </div>

        {/* Back - Hidden vote */}
        <div
          className={cn(
            'card-back absolute inset-0 rounded-xl flex items-center justify-center',
            'border-2 border-primary/50',
            'bg-gradient-to-br from-primary/20 to-accent/20',
            'backdrop-blur-sm'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-primary/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
