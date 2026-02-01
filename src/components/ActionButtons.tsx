import { Button } from '@/components/ui/button';
import { RotateCcw, Sparkles, Download } from 'lucide-react';

interface ActionButtonsProps {
  onReset: () => void;
  onLoadExample: () => void;
  onExport: () => void;
}

export const ActionButtons = ({ onReset, onLoadExample, onExport }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button variant="outline" size="sm" onClick={onLoadExample} className="gap-2">
        <Sparkles className="h-4 w-4" />
        Example Values
      </Button>
      <Button variant="secondary" size="sm" onClick={onExport} className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
