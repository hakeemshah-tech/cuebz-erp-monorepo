"use client";

import React from "react";
import { Title } from "rizzui";
import cn from "../../utils/class-names";

export interface WidgetCardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  rounded?: "sm" | "md" | "lg" | "xl" | "none";
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  children?: React.ReactNode;
}

const roundedStyles = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
} as const;

/**
 * Titled container for a dashboard widget. Children are laid out below an
 * optional header row carrying a title, description and trailing action slot.
 */
export default function WidgetCard({
  title,
  description,
  action,
  rounded = "md",
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  actionClassName,
  children,
}: WidgetCardProps) {
  const hasHeader = Boolean(title || description || action);

  return (
    <div
      className={cn(
        "border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900 lg:p-6",
        roundedStyles[rounded],
        className
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            "flex items-start justify-between gap-4",
            headerClassName
          )}
        >
          <div className="min-w-0">
            {title && (
              <Title
                as="h3"
                className={cn(
                  "text-base font-semibold sm:text-lg",
                  titleClassName
                )}
              >
                {title}
              </Title>
            )}
            {description && (
              <div className={cn("text-sm", descriptionClassName)}>
                {description}
              </div>
            )}
          </div>

          {action && (
            <div className={cn("shrink-0", actionClassName)}>{action}</div>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
