interface Props {
  message?: string;
}

export function LoadingSpinner({ message }: Props) {
  return (
    <div className="flex items-center justify-center">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      {message && <span className="ml-3 text-sm text-gray-500">{message}</span>}
    </div>
  );
}
