import type { ReactNode } from "react";

type Props = { children: ReactNode };

export default function ScreenLayout({ children }: Props) {
  return (
    <div className="h-screen bg-gray-100 flex flex-col p-3 overflow-hidden">
      {children}
      <footer className="text-xs text-gray-400 text-center mt-3">
        © D.T - {import.meta.env.VITE_APP_VERSION}
      </footer>
    </div>
  );
}
