type BadgeVariant = "default" | "black" | "red";

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  const base = "inline-flex items-center px-swiss-3 py-swiss-1 text-[0.75rem] font-semibold uppercase tracking-[0.05em] border";

  const variants: Record<BadgeVariant, string> = {
    default: "border-current text-swiss-black",
    black: "bg-swiss-black text-swiss-white border-swiss-black",
    red: "border-current text-swiss-red",
  };

  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
