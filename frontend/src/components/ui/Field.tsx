import { FieldError } from '@ui/FieldError';

// Shared with forms that build their own input classes, so every field error looks the same
export const inputErrorCls = 'border-alert focus:border-alert ring-3 ring-alert/12';

export const inputCls = (hasError?: boolean) =>
  `w-full border rounded-[9px] px-[14px] py-[11px] text-[14px] bg-paper focus:outline-none transition-colors ${
    hasError ? inputErrorCls : 'border-rule focus:border-brand-primary'
  }`;

// pr-9 clears the chevron base.css paints 13px from the right edge
export const selectCls = (hasError?: boolean) =>
  `w-full border rounded-[9px] pl-[14px] pr-9 py-[11px] text-[14px] bg-paper focus:outline-none transition-colors cursor-pointer ${
    hasError ? inputErrorCls : 'border-rule focus:border-brand-primary'
  }`;

export function Field({
  label,
  htmlFor,
  required,
  error,
  variant = 'mono',
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  variant?: 'mono' | 'plain';
  children: React.ReactNode;
}) {
  const labelCls =
    variant === 'plain'
      ? 'block text-[11px] text-faint mb-1.5'
      : 'block text-[10px] font-mono uppercase tracking-[.1em] text-muted mb-2';
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {required && <span className="ml-0.5 text-required">*</span>}
      </label>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}
