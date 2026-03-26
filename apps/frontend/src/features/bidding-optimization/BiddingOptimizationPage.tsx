import { useCallback, useRef, useState } from "react";
import { Navbar } from "../../shared/components/Navbar";
import { CsvUploader } from "./components/CsvUploader";
import { CampaignGrid } from "./components/CampaignGrid";
import type { AggregatedCampaign } from "./types";

export function BiddingOptimizationPage() {
  const [campaigns, setCampaigns] = useState<AggregatedCampaign[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const workerRef = useRef<Worker | null>(null);

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
        setCampaigns(e.data.data!);
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

  return (
    <div className="min-h-screen bg-cream">
      <Navbar toolName="Bidding Optimization" />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {!campaigns && !processing && (
          <CsvUploader onFileLoaded={handleFileLoaded} />
        )}

        {processing && (
          <div className="flex items-center justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
            <span className="ml-3 text-sm text-gray-500">Processing report...</span>
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        {campaigns && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {campaigns.length} campaigns
              </p>
              <button
                onClick={() => { setCampaigns(null); setError(null); }}
                className="text-xs text-gray-400 hover:text-gray-700"
              >
                Upload new report
              </button>
            </div>
            <CampaignGrid campaigns={campaigns} />
          </>
        )}
      </main>
    </div>
  );
}
