import { inputCls } from '@ui/Field';

interface Props {
  id: string;
  label: string;
  value: string | null;
  changed: boolean;
  onChange: (value: string) => void;
  variant: 'cell' | 'field';
}

const VARIANT_CLS = {
  cell: 'block w-full min-h-[58px] border-0 bg-transparent px-3 py-[11px] text-[12.5px] leading-[1.4] text-menu-dish-text focus:outline-2 focus:outline-brand-primary focus:-outline-offset-2',
  field: inputCls(),
};

// One dish box, shared by the desktop grid cell and the phone form field.
export function DishTextarea({ id, label, value, changed, onChange, variant }: Props) {
  return (
    <textarea
      id={id}
      aria-label={label}
      rows={variant === 'cell' ? 2 : 1}
      value={value ?? ''}
      placeholder="Agregar plato"
      data-changed={changed ? 'true' : 'false'}
      onChange={(e) => onChange(e.target.value)}
      className={`${VARIANT_CLS[variant]} resize-none placeholder:text-placeholder placeholder:italic ${
        variant === 'field' && changed ? '!bg-warn-bg' : ''
      }`}
    />
  );
}
