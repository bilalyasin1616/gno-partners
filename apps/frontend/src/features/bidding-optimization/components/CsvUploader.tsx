import { useCallback, useRef, useState } from "react";

interface Props {
  onFileLoaded: (csvText: string) => void;
}

export function CsvUploader({ onFileLoaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) return;
      const reader = new FileReader();
      reader.onload = () => onFileLoaded(reader.result as string);
      reader.readAsText(file);
    },
    [onFileLoaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-16 transition-colors ${
        dragging
          ? "border-gold-500 bg-gold-300/10"
          : "border-gray-300 bg-white hover:border-gold-400"
      }`}
    >
      <p className="text-sm font-medium text-gray-700">
        Drop your SP Campaign Report CSV here
      </p>
      <p className="mt-1 text-xs text-gray-400">or click to browse</p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
