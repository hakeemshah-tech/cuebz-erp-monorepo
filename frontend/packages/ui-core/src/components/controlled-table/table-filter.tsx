"use client";

import React from "react";
import { Button, Drawer, Title } from "rizzui";
import cn from "../../utils/class-names";

export interface FilterDrawerViewProps {
  isOpen: boolean;
  setOpenDrawer: (isOpen: boolean) => void;
  drawerTitle?: string;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
  applyButtonText?: string;
  clearButtonText?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Slide-over container for a table's filter controls.
 *
 * The drawer owns only presentation; each list page keeps its own filter state
 * and passes the inputs as children, so filter shape stays per-module.
 */
export function FilterDrawerView({
  isOpen,
  setOpenDrawer,
  drawerTitle = "Filters",
  onApplyFilters,
  onClearFilters,
  applyButtonText = "Apply Filters",
  clearButtonText = "Clear",
  className,
  children,
}: FilterDrawerViewProps) {
  function close() {
    setOpenDrawer(false);
  }

  function handleApply() {
    onApplyFilters?.();
    close();
  }

  return (
    <Drawer isOpen={isOpen} onClose={close} placement="right" size="sm">
      <div className={cn("flex h-full flex-col", className)}>
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <Title as="h5" className="text-base font-semibold">
            {drawerTitle}
          </Title>
          <Button
            variant="text"
            onClick={close}
            aria-label="Close filters"
            className="px-2"
          >
            ✕
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        <footer className="flex items-center gap-3 border-t border-gray-200 px-5 py-4 dark:border-gray-700">
          {onClearFilters && (
            <Button variant="outline" className="flex-1" onClick={onClearFilters}>
              {clearButtonText}
            </Button>
          )}
          <Button className="flex-1" onClick={handleApply}>
            {applyButtonText}
          </Button>
        </footer>
      </div>
    </Drawer>
  );
}

export default FilterDrawerView;
