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
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export function ShopNowButton() {
  return (
    <Button href="/skincare" variant="accent">
      Shop Now
    </Button>
  );
}

export function ShopTheBrandButton() {
  return (
    <Button href="/skincare" variant="primary">
      Shop the brand
    </Button>
  );
}

export function AddToCartButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="accent"
      className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide sm:px-3.5 ${className}`}
      onClick={onClick}
    >
      Add to Cart
    </Button>
  );
}

export function AddProductButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="accent"
      className={`shrink-0 ${className}`}
      onClick={onClick}
    >
      Add Product
    </Button>
  );
}

const adminActionClassName =
  "shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide";

export function ActiveButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="accent"
      className={`${adminActionClassName} ${className}`}
      onClick={onClick}
    >
      Active
    </Button>
  );
}

export function DisableButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={`${adminActionClassName} ${className}`}
      onClick={onClick}
    >
      Disable
    </Button>
  );
}

export function DeleteButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="outline"
      className={`${adminActionClassName} border-foreground/25 text-foreground/70 hover:border-foreground hover:bg-foreground hover:text-white ${className}`}
      onClick={onClick}
    >
      Delete
    </Button>
  );
}

export function UpdateButton({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="primary"
      className={`${adminActionClassName} ${className}`}
      onClick={onClick}
    >
      Update
    </Button>
  );
}
