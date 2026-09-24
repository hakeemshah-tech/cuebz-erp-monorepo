"use client";

import React, { useRef, useState } from "react";
import cn from "../utils/class-names";

/** Named accept presets used across the app, mapped to input accept strings. */
const ACCEPT_PRESETS: Record<string, string> = {
  img: "image/*",
  pdf: "application/pdf",
  imgAndPdf: "image/*,application/pdf",
  csv: ".csv,text/csv",
  xlsx: ".xlsx,.xls,application/vnd.ms-excel",
  all: "*/*",
};

export interface UploadProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "accept"> {
  accept?: keyof typeof ACCEPT_PRESETS | (string & {});
  placeholderText?: string;
  label?: React.ReactNode;
  error?: string;
  className?: string;
}

/**
 * Click-or-drop file field.
 *
 * It forwards the native change event unchanged, so callers keep reading
 * `event.target.files` exactly as they would from a plain input.
 */
export default function Upload({
  accept = "all",
  placeholderText = "Drop a file here, or click to browse",
  label,
  error,
  className,
  multiple,
  onChange,
  disabled,
  ...rest
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const acceptValue = ACCEPT_PRESETS[accept as string] ?? accept;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFileNames(Array.from(event.target.files ?? []).map((file) => file.name));
    onChange?.(event);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled || !inputRef.current) return;

    // Route dropped files through the hidden input so listeners see a normal
    // change event with a populated FileList.
    inputRef.current.files = event.dataTransfer.files;
    inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return (
    <div className={cn("w-full", className && "contents")}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-5 py-8 text-center transition-colors",
          "border-gray-300 hover:border-primary dark:border-gray-600",
          isDragging && "border-primary bg-primary-lighter/20",
          error && "border-red-500",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
          <path d="M3.5 15v3A2.5 2.5 0 0 0 6 20.5h12a2.5 2.5 0 0 0 2.5-2.5v-3" />
        </svg>

        <span className="text-sm text-gray-600 dark:text-gray-300">
          {fileNames.length > 0 ? fileNames.join(", ") : placeholderText}
        </span>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept={acceptValue}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          {...rest}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
