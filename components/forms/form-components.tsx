"use client";

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  min?: string;
  ariaDescribedBy?: string;
}

/**
 * Reusable form field component with validation
 * Eliminates duplicate form field code across the application
 */
export function FormField({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  maxLength,
  min,
  ariaDescribedBy
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy || (error ? `${id}-error` : undefined)}
        disabled={disabled}
        maxLength={maxLength}
        {...(min !== undefined && { min: min })}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  id: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  minLength?: number;
  ariaDescribedBy?: string;
}

/**
 * Reusable textarea field component
 * Eliminates duplicate textarea code
 */
export function TextAreaField({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  minLength,
  ariaDescribedBy
}: TextAreaFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50 resize-none ${
          error ? "border-red-500" : "border-neutral-300"
        }`}
        aria-invalid={!!error}
        aria-describedby={ariaDescribedBy || (error ? `${id}-error` : undefined)}
        disabled={disabled}
        maxLength={maxLength}
        {...(minLength !== undefined && { minLength: minLength })}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

interface FormActionsProps {
  submitText: string;
  cancelText?: string;
  onSubmit?: (e: React.FormEvent) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitDisabled?: boolean;
  variant?: "default" | "outline";
}

/**
 * Reusable form actions component
 * Eliminates duplicate button code
 */
export function FormActions({
  submitText,
  cancelText,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitDisabled = false,
  variant = "default"
}: FormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || submitDisabled}
        className="flex-1 sm:flex-none w-full sm:w-auto"
        onClick={onSubmit}
      >
        {isSubmitting ? "Submitting..." : submitText}
      </Button>
      {onCancel && cancelText && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isSubmitting}
          onClick={onCancel}
          className="flex-1 sm:flex-none w-full sm:w-auto"
        >
          {cancelText}
        </Button>
      )}
    </div>
  );
}

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Reusable error alert component
 * Eliminates duplicate error alert code
 */
export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" role="alert" aria-live="assertive">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-red-900 dark:text-red-100 font-medium">
            {message}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            aria-label="Dismiss error"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </Card>
  );
}

interface InfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable info card component
 * Eliminates duplicate card code
 */
export function InfoCard({ title, children, className = "" }: InfoCardProps) {
  return (
    <Card className={`p-6 dark:bg-neutral-800 ${className}`}>
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
        {title}
      </h2>
      {children}
    </Card>
  );
}