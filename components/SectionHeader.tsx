export function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-swiss-gray-600 pb-swiss-4 border-b border-swiss-gray-200 mb-swiss-7">
      {children}
    </h2>
  );
}
