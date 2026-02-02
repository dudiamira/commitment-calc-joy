import { CategorySavings, SavingsResult } from '@/types/calculator';
import { TrendingUp, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsCardProps {
  type: '30d' | '1y';
  total: number;
  breakdown: CategorySavings[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const SavingsCard = ({ type, total, breakdown }: SavingsCardProps) => {
  const is30d = type === '30d';
  const Icon = is30d ? Clock : Calendar;

  return (
    <div className={cn('savings-card', is30d ? 'savings-card-30d' : 'savings-card-1y')}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'p-2 rounded-lg',
            is30d ? 'bg-savings-30d/20 text-savings-30d' : 'bg-savings-1y/20 text-savings-1y'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            {is30d ? '30-Day Commitment' : '1-Year Commitment'}
          </h3>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Annual Savings
        </p>
        <p
          className={cn(
            'text-3xl font-bold',
            is30d ? 'text-savings-30d' : 'text-savings-1y'
          )}
        >
          {formatCurrency(total)}
        </p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Per Category
        </p>
        {breakdown.map((cat) => {
          const value = is30d ? cat.annual30d : cat.annual1y;
          return (
            <div
              key={cat.categoryId}
              className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
            >
              <span className="text-muted-foreground truncate mr-2">{cat.categoryName}</span>
              <span className="font-medium text-foreground whitespace-nowrap">
                {formatCurrency(value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface DifferenceCardProps {
  difference: number;
  coveredMonthly: number;
}

export const DifferenceCard = ({ difference, coveredMonthly }: DifferenceCardProps) => {
  return (
    <div className="rounded-xl bg-card p-6 border border-border shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Additional Savings</h3>
          <p className="text-sm text-muted-foreground">1-Year vs 30-Day</p>
        </div>
      </div>

      <p className="text-3xl font-bold text-primary mb-4">
        +{new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(difference)}
      </p>
    </div>
  );
};
