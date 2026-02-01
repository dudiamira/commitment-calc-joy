export type Provider = 'aws' | 'azure' | 'gcp';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoryInput {
  monthlyCost: number;
  coveragePercent: number;
}

export interface CategoryInputs {
  [categoryId: string]: CategoryInput;
}

export interface ProviderData {
  [provider: string]: CategoryInputs;
}

export interface SavingsResult {
  coveredMonthly: number;
  annual30d: number;
  annual1y: number;
  difference: number;
}

export interface CategorySavings extends SavingsResult {
  categoryId: string;
  categoryName: string;
}

export const PROVIDERS: { id: Provider; name: string; label: string }[] = [
  { id: 'aws', name: 'AWS', label: 'Amazon Web Services' },
  { id: 'azure', name: 'Azure', label: 'Microsoft Azure' },
  { id: 'gcp', name: 'GCP', label: 'Google Cloud Platform' },
];

export const CATEGORIES: Record<Provider, Category[]> = {
  aws: [
    { id: 'compute', name: 'Compute & Containers', description: 'EC2, Fargate' },
    { id: 'databases', name: 'Databases', description: 'RDS' },
    { id: 'analytics', name: 'Analytics & Search', description: 'Redshift, OpenSearch' },
    { id: 'serverless', name: 'Serverless', description: 'Lambda' },
  ],
  azure: [
    { id: 'compute', name: 'Compute', description: 'Virtual Machines' },
    { id: 'databases', name: 'Databases', description: 'PostgreSQL, MariaDB, SQL' },
    { id: 'app', name: 'App Platform', description: 'App Service Plan' },
    { id: 'storage', name: 'Storage & Cache', description: 'Managed Disks, Redis' },
  ],
  gcp: [
    { id: 'compute', name: 'Compute & Containers', description: 'Compute Engine, GKE' },
    { id: 'databases', name: 'Databases & Storage', description: 'Cloud SQL, Cloud Storage' },
    { id: 'analytics', name: 'Analytics & Integration', description: 'BigQuery, Pub/Sub' },
  ],
};

export const DISCOUNT_30D = 0.30;
export const DISCOUNT_1Y = 0.45;
