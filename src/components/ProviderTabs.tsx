import { Provider, PROVIDERS } from '@/types/calculator';
import { cn } from '@/lib/utils';

interface ProviderTabsProps {
  value: Provider;
  onChange: (provider: Provider) => void;
}

export const ProviderTabs = ({ value, onChange }: ProviderTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-secondary/50 rounded-xl">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          data-state={value === p.id ? 'active' : 'inactive'}
          className={cn(
            'provider-tab flex-1 min-w-[100px]',
            p.id === 'aws' && 'provider-tab-aws',
            p.id === 'azure' && 'provider-tab-azure',
            p.id === 'gcp' && 'provider-tab-gcp'
          )}
        >
          <span className="font-semibold">{p.name}</span>
        </button>
      ))}
    </div>
  );
};
