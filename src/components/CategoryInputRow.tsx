import { Category, CategoryInput } from '@/types/calculator';
import { DollarSign } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface CategoryInputRowProps {
  category: Category;
  input: CategoryInput;
  onUpdate: (field: keyof CategoryInput, value: number) => void;
}

export const CategoryInputRow = ({ category, input, onUpdate }: CategoryInputRowProps) => {
  const formatWithCommas = (value: number): string => {
    if (value === 0) return '';
    return new Intl.NumberFormat('en-US').format(value);
  };

  const parseFormattedNumber = (rawValue: string): number => {
    const cleanValue = rawValue.replace(/,/g, '');
    return parseFloat(cleanValue) || 0;
  };

  const handleNumberChange = (field: keyof CategoryInput, rawValue: string) => {
    const value = parseFormattedNumber(rawValue);
    onUpdate(field, value);
  };

  return (
    <div className="category-row animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{category.name}</h3>
          <p className="text-sm text-muted-foreground">Includes: {category.description}</p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 sm:items-center">
          {/* Monthly Cost */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Monthly Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                inputMode="numeric"
                value={formatWithCommas(input.monthlyCost)}
                onChange={(e) => handleNumberChange('monthlyCost', e.target.value)}
                placeholder="0"
                className="input-field pl-9 w-full sm:w-36"
              />
            </div>
          </div>

          {/* Coverage % Slider */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Current Coverage
            </label>
            <div className="flex items-center gap-3 min-w-[180px]">
              <Slider
                value={[input.coveragePercent]}
                onValueChange={(values) => onUpdate('coveragePercent', values[0])}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-medium text-foreground w-10 text-right tabular-nums">
                {input.coveragePercent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
