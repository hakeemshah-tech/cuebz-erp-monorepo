"use client";

import React from "react";
import ReactDatePicker, {
  type DatePickerProps as ReactDatePickerProps,
} from "react-datepicker";
import { Input, type InputProps } from "rizzui";
import cn from "../utils/class-names";

import "react-datepicker/dist/react-datepicker.css";

/**
 * With `selectsRange` react-datepicker hands back a `[start, end]` tuple and
 * otherwise a single date. Declaring the union explicitly keeps the callback
 * parameter inferable at both kinds of call site.
 */
export type DatePickerValue = Date | null | [Date | null, Date | null];

export interface DatePickerProps
  extends Omit<ReactDatePickerProps, "onChange" | "selected"> {
  selected?: Date | null;
  /**
   * Declared as a method rather than a property so the parameter is checked
   * bivariantly: handlers that only accept `Date | null` (the single-date
   * case, which is most of them) stay assignable alongside range handlers.
   */
  onChange(date: any, event?: React.SyntheticEvent<any> | undefined): void;
  label?: React.ReactNode;
  error?: string;
  className?: string;
  inputClassName?: string;
  /** Forwarded to the rizzui Input that renders the field. */
  inputProps?: Partial<InputProps>;
}

/**
 * react-datepicker wrapped so the field itself is a rizzui `Input`, keeping
 * date fields visually consistent with the rest of the form controls and
 * routing validation messages through the same `error` slot.
 */
export function DatePicker({
  selected,
  onChange,
  label,
  error,
  className,
  inputClassName,
  inputProps,
  dateFormat = "dd-MMM-yyyy",
  placeholderText = "Select date",
  popperPlacement = "bottom-start",
  ...rest
}: DatePickerProps) {
  // react-datepicker types its props as a large discriminated union keyed on
  // selectsRange/selectsMultiple. We accept the flattened shape and hand it
  // over in one cast rather than re-deriving the union at every call site.
  const datePickerProps = {
    selected,
    onChange,
    dateFormat,
    placeholderText,
    popperPlacement,
    wrapperClassName: "w-full",
    customInput: (
      <Input
        label={label}
        error={error}
        className={cn("w-full", inputClassName)}
        {...inputProps}
      />
    ),
    ...rest,
  } as unknown as ReactDatePickerProps;

  return (
    <div className={cn("w-full", className)}>
      <ReactDatePicker {...datePickerProps} />
    </div>
  );
}

export default DatePicker;
