import Link from "next/link";

type ButtonVariant = "primary" | "accent" | "outline";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-foreground hover:bg-primary/80",
  accent: "bg-accent text-white hover:bg-accent/90",
  outline:
    "border border-accent bg-transparent text-accent hover:bg-accent hover:text-white",
};

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}

export function ShopNowButton() {
  return (
    <Button href="/shop" variant="accent">
      Shop Now
    </Button>
  );
}

export function ShopTheBrandButton() {
  return (
    <Button href="/shop" variant="primary">
      Shop the brand
    </Button>
  );
}
