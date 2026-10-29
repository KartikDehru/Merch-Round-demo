import { TryProvider } from "@/lib/try-store";

export const metadata = {
  title: "Try a merch round — Merch Round",
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return (
    <TryProvider>
      <div className="min-h-[calc(100dvh-8rem)] bg-stone">
        <div className="mx-auto w-full max-w-md px-4 py-6 sm:py-10">{children}</div>
      </div>
    </TryProvider>
  );
}
