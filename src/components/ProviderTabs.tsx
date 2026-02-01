import { Provider, PROVIDERS } from '@/types/calculator';
import { cn } from '@/lib/utils';
import awsLogo from '@/assets/aws-logo.svg';
import azureLogo from '@/assets/azure-logo.svg';
import gcpLogo from '@/assets/gcp-logo.svg';

interface ProviderTabsProps {
  value: Provider;
  onChange: (provider: Provider) => void;
}

const logos: Record<Provider, string> = {
  aws: awsLogo,
  azure: azureLogo,
  gcp: gcpLogo,
};

export const ProviderTabs = ({ value, onChange }: ProviderTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-secondary/50 rounded-xl">
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          onClick={() => onChange(p.id)}
          data-state={value === p.id ? 'active' : 'inactive'}
          className={cn(
            'provider-tab flex-1 min-w-[100px] flex items-center justify-center',
            p.id === 'aws' && 'provider-tab-aws',
            p.id === 'azure' && 'provider-tab-azure',
            p.id === 'gcp' && 'provider-tab-gcp'
          )}
          aria-label={p.label}
        >
          <img 
            src={logos[p.id]} 
            alt={p.label} 
            className={cn(
              'h-6 transition-opacity',
              p.id === 'gcp' && 'h-5',
              value !== p.id && 'opacity-60'
            )}
          />
        </button>
      ))}
    </div>
  );
};
