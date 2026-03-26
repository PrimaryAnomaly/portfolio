import Link from "next/link";

type ButtonVariant = "default" | "primary" | "accent";
type ButtonSize = "default" | "sm" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  className?: string;
};

export function Button({
  children,
  variant = "default",
  size = "default",
  href,
  className = "",
}: ButtonProps) {
  const base = "inline-flex items-center justify-center font-semibold border-2 cursor-pointer transition-all duration-100";

  const variants: Record<ButtonVariant, string> = {
    default: "border-swiss-black bg-transparent text-swiss-black hover:bg-swiss-black hover:text-swiss-white",
    primary: "bg-swiss-black text-swiss-white border-swiss-black hover:bg-transparent hover:text-swiss-black",
    accent: "border-swiss-red text-swiss-red hover:bg-swiss-red hover:text-swiss-white",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-swiss-4 py-swiss-2 text-[0.75rem]",
    default: "px-swiss-5 py-swiss-3 text-[0.875rem]",
    lg: "px-swiss-7 py-swiss-4 text-[1rem]",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes}>
      {children}
    </button>
  );
}
