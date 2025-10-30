import { cn } from "@/utils/ui/cn";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        white: "bg-white text-black hover:bg-gray-100",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        brand:
          "bg-brand text-white hover:bg-brand/90 focus-visible:ring-brand/20 dark:focus-visible:ring-brand/40 dark:bg-brand/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xxxs: "h-5 rounded-md gap-1 px-1 has-[>svg]:px-1.5",
        xxs: "h-6 rounded-md gap-1 px-1 has-[>svg]:px-1.5",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-11 rounded-md px-6 has-[>svg]:px-4",
        xxl: "h-12 rounded-md px-6 has-[>svg]:px-4 gap-4",
        icon: "size-9",
      },
      isPending: {
        true: "animate-pulse opacity-80",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isPending: false,
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;

  // Allow controlling the button behavior via props
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

function Button({
  className,
  variant,
  size,

  asChild = false,

  // Status
  isPending,
  disabled,

  // Controlling events
  preventDefault = false,
  stopPropagation = false,
  onClick,

  // Rest of button props
  ...buttonProps
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  // Handle the button behavior via props
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) event.preventDefault();
    if (stopPropagation) event.stopPropagation();
    if (onClick) onClick(event);
  };

  return (
    <Comp
      data-slot="button"
      type="button"
      onClick={handleClick}
      disabled={disabled || isPending || false}
      className={cn(buttonVariants({ variant, size, className }))}
      {...buttonProps}
    />
  );
}

export { Button, buttonVariants };
