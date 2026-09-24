"use client";

import React from "react";
import SimpleBarReact, { type Props as SimpleBarProps } from "simplebar-react";
import cn from "../utils/class-names";

import "simplebar-react/dist/simplebar.min.css";

/**
 * Custom-scrollbar container used by the sidebar and long drawers, so the
 * scroll affordance looks the same across platforms.
 */
export default function SimpleBar({
  className,
  children,
  ...rest
}: SimpleBarProps & { children?: React.ReactNode }) {
  return (
    <SimpleBarReact className={cn("h-full w-full", className)} {...rest}>
      {children}
    </SimpleBarReact>
  );
}
