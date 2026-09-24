"use client";

import React, { useEffect } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodSchema } from "zod";

export interface FormProps<TFieldValues extends FieldValues> {
  onSubmit: SubmitHandler<TFieldValues>;
  children: (methods: UseFormReturn<TFieldValues>) => React.ReactNode;
  /** Zod schema wired through `zodResolver` when provided. */
  validationSchema?: ZodSchema<any>;
  useFormProps?: UseFormProps<TFieldValues>;
  /** When this value changes, the form resets to its default values. */
  resetValues?: unknown;
  className?: string;
  id?: string;
}

/**
 * Render-prop wrapper around react-hook-form.
 *
 * It owns the `useForm` instance and exposes it to children, so auth screens
 * can declare fields without repeating resolver and provider wiring. The
 * instance is also published through `FormProvider`, which keeps nested
 * `useFormContext()` components working.
 */
export function Form<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  children,
  validationSchema,
  useFormProps,
  resetValues,
  className,
  id,
}: FormProps<TFieldValues>) {
  const methods = useForm<TFieldValues>({
    ...(validationSchema && { resolver: zodResolver(validationSchema) }),
    ...useFormProps,
  });

  useEffect(() => {
    if (resetValues !== undefined) {
      methods.reset(resetValues as any);
    }
    // `methods.reset` is stable; resetting is driven solely by resetValues.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetValues]);

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        noValidate
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
}

export default Form;
