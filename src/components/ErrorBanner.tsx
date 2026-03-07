type Props = { message: string | null };

export default function ErrorBanner({ message }: Props) {
  if (!message) return null;
  return (
    <div className="mx-3 mb-1 px-4 py-3 bg-red-100 border border-red-400 text-red-700 font-semibold rounded-xl text-center animate-pulse">
      ⚠️ {message}
    </div>
  );
}
