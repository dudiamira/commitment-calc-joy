import { useCalculator } from '@/hooks/useCalculator';
import { ProviderTabs } from '@/components/ProviderTabs';
import { CategoryInputRow } from '@/components/CategoryInputRow';
import { SavingsCard, DifferenceCard } from '@/components/SavingsCard';
import { ActionButtons } from '@/components/ActionButtons';
import { DemoRequestForm } from '@/components/DemoRequestForm';
import { CATEGORIES } from '@/types/calculator';
import { Cloud, Calculator } from 'lucide-react';

const Index = () => {
  const {
    provider,
    setProvider,
    inputs,
    updateInput,
    reset,
    loadExample,
    calculate,
    categorySavings,
    totalSavings,
    calculated,
    exportCSV,
  } = useCalculator();

  const categories = CATEGORIES[provider];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Cloud Commitment Insurance Savings Calculator
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Estimate your yearly savings with 30-day or 1-year commitments
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 lg:py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Provider Selection */}
            <section>
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Cloud Provider
              </h2>
              <ProviderTabs value={provider} onChange={setProvider} />
            </section>

            {/* Action Buttons */}
            <ActionButtons onReset={reset} onLoadExample={loadExample} onCalculate={calculate} onExport={exportCSV} calculated={calculated} />

            {/* Category Inputs - hidden after calculation, replaced by demo form */}
            {!calculated ? (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Usage by Category
                </h2>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <CategoryInputRow
                      key={category.id}
                      category={category}
                      input={inputs[category.id]}
                      onUpdate={(field, value) => updateInput(category.id, field, value)}
                    />
                  ))}
                </div>
              </section>
            ) : (
              <DemoRequestForm />
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Estimated Annual Savings
            </h2>

            {!calculated ? (
              <div className="rounded-xl bg-card p-8 border border-border shadow-card text-center">
                <Calculator className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Enter your usage data and click <strong>Calculate</strong> to see your estimated savings.
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <SavingsCard
                  type="30d"
                  total={totalSavings.annual30d}
                  breakdown={categorySavings}
                />
                <SavingsCard
                  type="1y"
                  total={totalSavings.annual1y}
                  breakdown={categorySavings}
                />
                <DifferenceCard
                  difference={totalSavings.difference}
                  coveredMonthly={totalSavings.coveredMonthly}
                />
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground p-4 bg-secondary/50 rounded-lg">
              <strong>Disclaimer:</strong> These are estimates only. Actual savings depend on
              eligible services, commitment terms, and provider-specific pricing rules.
            </p>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
