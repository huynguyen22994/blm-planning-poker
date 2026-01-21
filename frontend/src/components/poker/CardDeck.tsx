import { PokerCard } from './PokerCard';
import { CardValue, FIBONACCI_CARDS } from '@/types/poker';

interface CardDeckProps {
  selectedValue: CardValue | null;
  onSelect: (value: CardValue) => void;
  disabled?: boolean;
}

export const CardDeck = ({ selectedValue, onSelect, disabled }: CardDeckProps) => {
  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
        Choose your card
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {FIBONACCI_CARDS.map((value) => (
          <PokerCard
            key={value}
            value={value}
            isSelected={selectedValue === value}
            onClick={() => !disabled && onSelect(value)}
            size="md"
          />
        ))}
      </div>
    </div>
  );
};
