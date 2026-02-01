import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles, Download, Calculator } from 'lucide-react';

interface ActionButtonsProps {
  onReset: () => void;
  onLoadExample: () => void;
  onCalculate: () => void;
  onExport: () => void;
  calculated: boolean;
}

export const ActionButtons = ({ onReset, onLoadExample, onCalculate, onExport, calculated }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={onCalculate} className="gap-2">
        <Calculator className="h-4 w-4" />
        Calculate
      </Button>
      <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={onLoadExample} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Example Values
      </Button>
      <Button variant="secondary" size="sm" onClick={onExport} className="gap-2" disabled={!calculated}>
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
