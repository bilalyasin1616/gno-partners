interface Props {
  bsr: number | null;
  label?: string;
}

export function BsrBadge({ bsr, label }: Props) {
  if (bsr === null)
    return <span className="text-xs text-gray-400">No BSR</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-gold-300/30 px-2.5 py-0.5 text-xs font-semibold text-gold-600">
      BSR #{bsr.toLocaleString()}
      {label && <span className="ml-1 font-normal opacity-70">· {label}</span>}
    </span>
  );
}
