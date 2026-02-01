import { Category, CategoryInput } from '@/types/calculator';
import { DollarSign, Percent } from 'lucide-react';

interface CategoryInputRowProps {
  category: Category;
  input: CategoryInput;
  onUpdate: (field: keyof CategoryInput, value: number) => void;
}

export const CategoryInputRow = ({ category, input, onUpdate }: CategoryInputRowProps) => {
  const handleNumberChange = (field: keyof CategoryInput, rawValue: string) => {
    const value = parseFloat(rawValue) || 0;
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
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          {/* Monthly Cost */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Monthly Cost
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                min="0"
                step="100"
                value={input.monthlyCost || ''}
                onChange={(e) => handleNumberChange('monthlyCost', e.target.value)}
                placeholder="0"
                className="input-field pl-9 w-full sm:w-36"
              />
            </div>
          </div>

          {/* Coverage % */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Coverage
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={input.coveragePercent || ''}
                onChange={(e) => handleNumberChange('coveragePercent', e.target.value)}
                placeholder="0"
                className="input-field pr-9 w-full sm:w-28"
              />
              <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
