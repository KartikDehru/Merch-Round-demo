import { TryProvider } from "@/lib/try-store";

export const metadata = {
  title: "Try a merch round — Merch Round",
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
  return (
    <TryProvider>
      <div className="min-h-[calc(100dvh-7rem)] bg-stone pb-8">
        <div className="mx-auto w-full max-w-md px-4 py-4 sm:py-8">{children}</div>
      </div>
    </TryProvider>
  );
}
