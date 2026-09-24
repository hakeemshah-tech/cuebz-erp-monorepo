"use client";

import React from "react";
import { Button } from "rizzui";
import cn from "../utils/class-names";

export interface FormFooterProps {
  submitBtnText?: string;
  altBtnText?: string;
  isLoading?: boolean;
  isSubmitDisabled?: boolean;
  handleAltBtn?: () => void;
  onCancel?: () => void;
  className?: string;
}

/**
 * Sticky action bar for long entity forms. It renders a submit button of
 * `type="submit"`, so the enclosing <form> owns submission; the component
 * never calls onSubmit itself.
 */
export default function FormFooter({
  submitBtnText = "Save",
  altBtnText = "Cancel",
  isLoading = false,
  isSubmitDisabled = false,
  handleAltBtn,
  onCancel,
  className,
}: FormFooterProps) {
  const handleCancel = onCancel ?? handleAltBtn;

  return (
    <div
      className={cn(
        "sticky bottom-0 left-0 right-0 z-10 -mx-4 mt-6 flex items-center justify-end gap-3",
        "border-t border-gray-200 bg-white px-4 py-4",
        "dark:border-gray-700 dark:bg-gray-900",
        className
      )}
    >
      {handleCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {altBtnText}
        </Button>
      )}

      <Button type="submit" isLoading={isLoading} disabled={isSubmitDisabled}>
        {submitBtnText}
      </Button>
    </div>
  );
}
