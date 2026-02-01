import { useState, useMemo, useCallback } from 'react';
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

export const useCalculator = () => {
  const [provider, setProvider] = useState<Provider>('aws');
  const [inputs, setInputs] = useState<ProviderData>(createInitialInputs);

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
    },
    [provider]
  );

  const reset = useCallback(() => {
    setInputs(createInitialInputs());
  }, []);

  const loadExample = useCallback(() => {
    setInputs(EXAMPLE_DATA);
  }, []);

  const categorySavings = useMemo((): CategorySavings[] => {
    const categories = CATEGORIES[provider];
    const providerInputs = inputs[provider];

    return categories.map((cat) => {
      const input = providerInputs[cat.id];
      const coveredMonthly = input.monthlyCost * (input.coveragePercent / 100);
      const annual30d = coveredMonthly * DISCOUNT_30D * 12;
      const annual1y = coveredMonthly * DISCOUNT_1Y * 12;

      return {
        categoryId: cat.id,
        categoryName: cat.name,
        coveredMonthly,
        annual30d,
        annual1y,
        difference: annual1y - annual30d,
      };
    });
  }, [provider, inputs]);

  const totalSavings = useMemo((): SavingsResult => {
    return categorySavings.reduce(
      (acc, cat) => ({
        coveredMonthly: acc.coveredMonthly + cat.coveredMonthly,
        annual30d: acc.annual30d + cat.annual30d,
        annual1y: acc.annual1y + cat.annual1y,
        difference: acc.difference + cat.difference,
      }),
      { coveredMonthly: 0, annual30d: 0, annual1y: 0, difference: 0 }
    );
  }, [categorySavings]);

  const exportCSV = useCallback(() => {
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
      const savings = categorySavings.find((s) => s.categoryId === cat.id)!;
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
      totalSavings.coveredMonthly.toFixed(2),
      totalSavings.annual30d.toFixed(2),
      totalSavings.annual1y.toFixed(2),
      totalSavings.difference.toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud-savings-${provider}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [provider, inputs, categorySavings, totalSavings]);

  return {
    provider,
    setProvider,
    inputs: inputs[provider],
    updateInput,
    reset,
    loadExample,
    categorySavings,
    totalSavings,
    exportCSV,
  };
};
