import { useState, useCallback } from 'react';
import {
  Provider,
  ProviderData,
  CategoryInput,
  CategorySavings,
  SavingsResult,
  CATEGORIES,
  DISCOUNT_30D,
  DISCOUNT_1Y,
} from '@/types/calculator';

const createInitialInputs = (): ProviderData => {
  const data: ProviderData = {};
  (['aws', 'azure', 'gcp'] as Provider[]).forEach((provider) => {
    data[provider] = {};
    CATEGORIES[provider].forEach((cat) => {
      data[provider][cat.id] = { monthlyCost: 0, coveragePercent: 0 };
    });
  });
  return data;
};

const EXAMPLE_DATA: ProviderData = {
  aws: {
    compute: { monthlyCost: 5000, coveragePercent: 70 },
    databases: { monthlyCost: 2000, coveragePercent: 80 },
    analytics: { monthlyCost: 1500, coveragePercent: 60 },
    serverless: { monthlyCost: 800, coveragePercent: 50 },
  },
  azure: {
    compute: { monthlyCost: 4000, coveragePercent: 75 },
    databases: { monthlyCost: 1800, coveragePercent: 85 },
    app: { monthlyCost: 1200, coveragePercent: 65 },
    storage: { monthlyCost: 600, coveragePercent: 90 },
  },
  gcp: {
    compute: { monthlyCost: 3500, coveragePercent: 70 },
    databases: { monthlyCost: 2200, coveragePercent: 75 },
    analytics: { monthlyCost: 1800, coveragePercent: 55 },
  },
};

const createEmptyResults = (): { categorySavings: CategorySavings[]; totalSavings: SavingsResult } => ({
  categorySavings: [],
  totalSavings: { coveredMonthly: 0, annual30d: 0, annual1y: 0, difference: 0 },
});

export const useCalculator = () => {
  const [provider, setProvider] = useState<Provider>('aws');
  const [inputs, setInputs] = useState<ProviderData>(createInitialInputs);
  const [results, setResults] = useState<{
    categorySavings: CategorySavings[];
    totalSavings: SavingsResult;
    calculated: boolean;
  }>({ ...createEmptyResults(), calculated: false });

  const updateInput = useCallback(
    (categoryId: string, field: keyof CategoryInput, value: number) => {
      setInputs((prev) => ({
        ...prev,
        [provider]: {
          ...prev[provider],
          [categoryId]: {
            ...prev[provider][categoryId],
            [field]: field === 'coveragePercent' ? Math.min(100, Math.max(0, value)) : Math.max(0, value),
          },
        },
      }));
      // Mark as not calculated when inputs change
      setResults((prev) => ({ ...prev, calculated: false }));
    },
    [provider]
  );

  const reset = useCallback(() => {
    setInputs(createInitialInputs());
    setResults({ ...createEmptyResults(), calculated: false });
  }, []);

  const loadExample = useCallback(() => {
    setInputs(EXAMPLE_DATA);
    setResults((prev) => ({ ...prev, calculated: false }));
  }, []);

  const calculate = useCallback(() => {
    const categories = CATEGORIES[provider];
    const providerInputs = inputs[provider];

    const categorySavings = categories.map((cat) => {
      const input = providerInputs[cat.id];
      // Coverage represents what's ALREADY covered - savings apply to the REMAINING uncovered portion
      const remainingPercent = (100 - input.coveragePercent) / 100;
      const eligibleMonthly = input.monthlyCost * remainingPercent;
      const annual30d = eligibleMonthly * DISCOUNT_30D * 12;
      const annual1y = eligibleMonthly * DISCOUNT_1Y * 12;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        coveredMonthly: eligibleMonthly,
        annual30d,
        annual1y,
        difference: annual1y - annual30d,
      };
    });

    const totalSavings = categorySavings.reduce(
      (acc, cat) => ({
        coveredMonthly: acc.coveredMonthly + cat.coveredMonthly,
        annual30d: acc.annual30d + cat.annual30d,
        annual1y: acc.annual1y + cat.annual1y,
        difference: acc.difference + cat.difference,
      }),
      { coveredMonthly: 0, annual30d: 0, annual1y: 0, difference: 0 }
    );

    setResults({ categorySavings, totalSavings, calculated: true });
  }, [provider, inputs]);

  const exportCSV = useCallback(() => {
    if (!results.calculated) return;

    const categories = CATEGORIES[provider];
    const providerInputs = inputs[provider];

    const headers = [
      'Category',
      'Monthly Cost ($)',
      'Coverage (%)',
      'Covered Monthly ($)',
      '30-Day Savings ($)',
      '1-Year Savings ($)',
      'Difference ($)',
    ];

    const rows = categories.map((cat) => {
      const input = providerInputs[cat.id];
      const savings = results.categorySavings.find((s) => s.categoryId === cat.id)!;
      return [
        cat.name,
        input.monthlyCost.toFixed(2),
        input.coveragePercent.toFixed(2),
        savings.coveredMonthly.toFixed(2),
        savings.annual30d.toFixed(2),
        savings.annual1y.toFixed(2),
        savings.difference.toFixed(2),
      ];
    });

    rows.push([
      'TOTAL',
      '',
      '',
      results.totalSavings.coveredMonthly.toFixed(2),
      results.totalSavings.annual30d.toFixed(2),
      results.totalSavings.annual1y.toFixed(2),
      results.totalSavings.difference.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud-savings-${provider}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [provider, inputs, results]);

  return {
    provider,
    setProvider,
    inputs: inputs[provider],
    updateInput,
    reset,
    loadExample,
    calculate,
    categorySavings: results.categorySavings,
    totalSavings: results.totalSavings,
    calculated: results.calculated,
    exportCSV,
  };
};
