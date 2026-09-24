"use client";

import { useIsMounted } from "@core/hooks/use-is-mounted";
import HydrogenLayout from "@/layouts/hydrogen/layout";

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutProvider = ({ children }: LayoutProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return <HydrogenLayout>{children}</HydrogenLayout>;
};

export default LayoutProvider;
