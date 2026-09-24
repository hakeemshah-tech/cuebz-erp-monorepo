"use client";

import React from "react";
import { DatePicker, type DatePickerProps } from "../../ui/datepicker";

export type DateFieldProps = DatePickerProps;

/**
 * Date filter field for table toolbars.
 *
 * Exported as `DateFiled` at several call sites, so the original spelling is
 * kept as the default export so those imports keep resolving.
 */
export default function DateField(props: DateFieldProps) {
  return <DatePicker placeholderText="Select date" {...props} />;
}

export { DateField, DateField as DateFiled };
