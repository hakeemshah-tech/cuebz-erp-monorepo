import Image from "next/image";
import React from "react";

export interface LogoProps {
  iconOnly?: boolean;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

/**
 * Application wordmark. The asset lives in each app's `public/` directory, so
 * swapping the brand is a file replacement rather than a code change.
 */
export default function Logo({
  iconOnly = false,
  className,
  width = 120,
  height = 40,
  alt = "Logo",
}: LogoProps) {
  return (
    <Image
      src={iconOnly ? "/logo-primary.svg" : "/logo-primary-text.svg"}
      alt={alt}
      width={iconOnly ? height : width}
      height={height}
      className={className}
      priority
    />
  );
}
