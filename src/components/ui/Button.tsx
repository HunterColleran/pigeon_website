import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-mono text-xs tracking-[0.15em] uppercase transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-signal-orange text-cloud px-6 py-3 hover:brightness-110 active:scale-[0.97]",
    ghost: "text-concrete/40 hover:text-cloud px-3 py-2",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
