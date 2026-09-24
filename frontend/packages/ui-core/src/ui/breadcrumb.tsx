// Intentionally NOT a client component. It holds no state and no handlers, and
// server components render `<Breadcrumb.Item>` directly; a compound property
// on a client reference cannot be resolved through the RSC client manifest.
import React from "react";
import Link from "next/link";
import cn from "../utils/class-names";

export interface BreadcrumbItemProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

function BreadcrumbItem({ href, className, children }: BreadcrumbItemProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={cn(
          "text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100",
          className
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      aria-current="page"
      className={cn("font-medium text-gray-900 dark:text-gray-100", className)}
    >
      {children}
    </span>
  );
}

export interface BreadcrumbProps {
  separator?: React.ReactNode;
  separatorVariant?: "circle" | "slash" | "chevron";
  className?: string;
  children: React.ReactNode;
}

const defaultSeparators: Record<
  NonNullable<BreadcrumbProps["separatorVariant"]>,
  React.ReactNode
> = {
  circle: <span className="inline-block h-1 w-1 rounded-full bg-gray-300" />,
  slash: "/",
  chevron: "›",
};

/**
 * Breadcrumb trail. An explicit `separator` wins; otherwise the glyph comes
 * from `separatorVariant`. Passing `separator=""` selects the variant default,
 * which is how the page header uses it.
 */
function Breadcrumb({
  separator,
  separatorVariant = "slash",
  className,
  children,
}: BreadcrumbProps) {
  const items = React.Children.toArray(children).filter(Boolean);
  const divider =
    separator !== undefined && separator !== ""
      ? separator
      : defaultSeparators[separatorVariant];

  return (
    <nav aria-label="Breadcrumb">
      <ol className={cn("flex items-center gap-2 text-sm", className)}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            {item}
            {index < items.length - 1 && (
              <span aria-hidden className="text-gray-300">
                {divider}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
export { BreadcrumbItem };
