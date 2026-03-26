export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`max-w-[1200px] mx-auto px-swiss-6 ${className}`}>
      {children}
    </div>
  );
}
