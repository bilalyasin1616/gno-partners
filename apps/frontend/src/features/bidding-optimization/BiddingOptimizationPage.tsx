import { useCallback, useMemo, useRef, useState } from "react";
import { Navbar } from "../../shared/components/Navbar";
import { CsvUploader } from "./components/CsvUploader";
import { CampaignGrid } from "./components/campaign-grid/CampaignGrid";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ApplyBar } from "./components/apply-bar/ApplyBar";
import { ApplyModal } from "./components/apply-bar/ApplyModal";
import { RuleConfigModal } from "./components/rule-config/RuleConfigModal";
import { createEmptyRules, buildRulesMap, hasAnyRulesSet, hasIncompleteRules, clearDependentRules } from "./utils/rules";
import { createDefaultRuleConfig } from "./utils/rule-config";
import type { AggregatedCampaign, CampaignRules, RuleConfig } from "./types";

export function BiddingOptimizationPage() {
  const [campaigns, setCampaigns] = useState<AggregatedCampaign[] | null>(null);
  const [rulesMap, setRulesMap] = useState<Map<string, CampaignRules>>(new Map());
  const [ruleConfig, setRuleConfig] = useState<RuleConfig>(createDefaultRuleConfig);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const hasRules = useMemo(() => hasAnyRulesSet(rulesMap), [rulesMap]);
  const hasIncomplete = useMemo(() => hasIncompleteRules(rulesMap), [rulesMap]);
  const canApply = hasRules && !hasIncomplete;

  const applyDisabledReason = !hasRules
    ? "Set at least one rule to apply"
    : hasIncomplete
      ? "Fill in the required Good ACOS < threshold for all campaigns with Inc Good ACOS set"
      : undefined;

  const handleFileLoaded = useCallback((csvText: string) => {
    setError(null);
    setProcessing(true);

    workerRef.current?.terminate();
    const worker = new Worker(
      new URL("./workers/csv-processor.worker.ts", import.meta.url),
      { type: "module" }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<{ success: boolean; data?: AggregatedCampaign[]; error?: string }>) => {
      setProcessing(false);
      if (e.data.success) {
        const data = e.data.data!;
        setCampaigns(data);
        setRulesMap(buildRulesMap(data));
      } else {
        setError(e.data.error ?? "Failed to process CSV");
      }
      worker.terminate();
    };

    worker.onerror = () => {
      setProcessing(false);
      setError("Worker failed unexpectedly");
      worker.terminate();
    };

    worker.postMessage(csvText);
  }, []);

  const handleRuleChanged = useCallback(
    (campaignName: string, field: keyof CampaignRules, value: string | boolean) => {
      setRulesMap((prev) => {
        const next = new Map(prev);
        let rules = { ...(next.get(campaignName) ?? createEmptyRules()) };
        (rules[field] as string | boolean) = value;
        rules = clearDependentRules(field, rules);
        next.set(campaignName, rules);
        return next;
      });
    },
    []
  );

  return (
    <div className="flex h-screen flex-col bg-cream">
      <Navbar toolName="Bidding Optimization" />

      {!campaigns && !processing && (
        <main className="mx-auto w-full max-w-2xl px-6 py-8">
          <CsvUploader onFileLoaded={handleFileLoaded} />
        </main>
      )}

      {processing && (
        <div className="flex flex-1 items-center justify-center">
          <LoadingSpinner message="Processing report..." />
        </div>
      )}

      {error && (
        <p className="mt-4 text-center text-sm text-red-600">{error}</p>
      )}

      {campaigns && (
        <div className="flex min-h-0 flex-1 flex-col px-2">
          <div className="min-h-0 flex-1">
            <CampaignGrid
              campaigns={campaigns}
              rulesMap={rulesMap}
              onRuleChanged={handleRuleChanged}
            />
          </div>
          <ApplyBar
            canApply={canApply}
            disabledReason={applyDisabledReason}
            onApplyClick={() => setShowApplyModal(true)}
            onConfigClick={() => setShowConfigModal(true)}
            onReload={() => { setCampaigns(null); setRulesMap(new Map()); setError(null); }}
          />
        </div>
      )}

      {showApplyModal && (
        <ApplyModal rulesMap={rulesMap} ruleConfig={ruleConfig} onClose={() => setShowApplyModal(false)} />
      )}

      {showConfigModal && (
        <RuleConfigModal config={ruleConfig} onSave={setRuleConfig} onClose={() => setShowConfigModal(false)} />
      )}
    </div>
  );
}
