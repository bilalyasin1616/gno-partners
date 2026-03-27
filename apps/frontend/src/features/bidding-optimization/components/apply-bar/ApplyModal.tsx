import { useCallback, useRef, useState } from "react";
import type { CampaignRules } from "../../types";
import { downloadBlob } from "../../utils/rules";
import { LoadingSpinner } from "../LoadingSpinner";

type ApplyModalState = "upload" | "processing" | "done" | "error";

interface Props {
  rulesMap: Map<string, CampaignRules>;
  onClose: () => void;
}

export function ApplyModal({ rulesMap, onClose }: Props) {
  const [modalState, setModalState] = useState<ApplyModalState>("upload");
  const [modifiedCount, setModifiedCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setModalState("processing");
      const reader = new FileReader();

      reader.onload = () => {
        workerRef.current?.terminate();
        const worker = new Worker(
          new URL("../../workers/xlsx-processor.worker.ts", import.meta.url),
          { type: "module" }
        );
        workerRef.current = worker;

        worker.onmessage = (e: MessageEvent<{ success: boolean; blob?: Blob; modifiedCount?: number; error?: string }>) => {
          if (e.data.success) {
            setResultBlob(e.data.blob!);
            setModifiedCount(e.data.modifiedCount!);
            setModalState("done");
          } else {
            setErrorMessage(e.data.error ?? "Failed to process file");
            setModalState("error");
          }
          worker.terminate();
        };

        worker.onerror = () => {
          setErrorMessage("Worker failed unexpectedly");
          setModalState("error");
          worker.terminate();
        };

        const buffer = reader.result as ArrayBuffer;
        worker.postMessage(
          { xlsxBuffer: buffer, rulesMap: Array.from(rulesMap.entries()) },
          [buffer]
        );
      };

      reader.readAsArrayBuffer(file);
    },
    [rulesMap]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDownload = useCallback(() => {
    if (resultBlob) downloadBlob(resultBlob, "bulk_operations_modified.xlsx");
  }, [resultBlob]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Apply Rules to Bulk Sheet</h2>

        {modalState === "upload" && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-12 hover:border-gold-400 transition-colors"
          >
            <p className="text-sm font-medium text-gray-700">Drop your Bulk Operations XLSX here</p>
            <p className="mt-1 text-xs text-gray-400">or click to browse</p>
            <input ref={inputRef} type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" />
          </div>
        )}

        {modalState === "processing" && (
          <div className="py-12">
            <LoadingSpinner message="Applying rules..." />
          </div>
        )}

        {modalState === "done" && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-semibold text-gold-600">{modifiedCount}</span> targets modified
            </p>
            <button
              onClick={handleDownload}
              className="rounded-md bg-gold-500 px-6 py-2 text-sm font-medium text-white hover:bg-gold-600 transition-colors"
            >
              Download Modified File
            </button>
          </div>
        )}

        {modalState === "error" && (
          <div className="text-center py-8">
            <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
            <button
              onClick={() => setModalState("upload")}
              className="text-sm text-gray-400 hover:text-gray-700"
            >
              Try again
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="text-xs text-gray-400 hover:text-gray-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
