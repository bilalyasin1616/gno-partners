import { useCallback, useMemo, useRef, useState } from "react";
import { Navbar } from "../../shared/components/Navbar";
import { CsvUploader } from "./components/CsvUploader";
import { CampaignGrid } from "./components/campaign-grid/CampaignGrid";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ApplyBar } from "./components/apply-bar/ApplyBar";
import { ApplyModal } from "./components/apply-bar/ApplyModal";
import { createEmptyRules, buildRulesMap, hasAnyRulesSet } from "./utils/rules";
import type { AggregatedCampaign, CampaignRules } from "./types";

export function BiddingOptimizationPage() {
  const [campaigns, setCampaigns] = useState<AggregatedCampaign[] | null>(null);
  const [rulesMap, setRulesMap] = useState<Map<string, CampaignRules>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  const hasRules = useMemo(() => hasAnyRulesSet(rulesMap), [rulesMap]);

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
        const rules = { ...(next.get(campaignName) ?? createEmptyRules()) };
        (rules[field] as string | boolean) = value;
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
            hasRules={hasRules}
            onApplyClick={() => setShowApplyModal(true)}
            onReload={() => { setCampaigns(null); setRulesMap(new Map()); setError(null); }}
          />
        </div>
      )}

      {showApplyModal && (
        <ApplyModal rulesMap={rulesMap} onClose={() => setShowApplyModal(false)} />
      )}
    </div>
  );
}
