import { useState } from 'react';

interface ListEditorProps {
  label: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}

export function ListEditor({ label, items, onAdd, onRemove }: ListEditorProps) {
  const [draft, setDraft] = useState('');
  const add = () => {
    onAdd(draft);
    setDraft('');
  };

  return (
    <div>
      <p className="mb-2 text-[12px] font-semibold text-ink-2">{label}</p>
      <div className="min-h-[76px] rounded-[10px] border border-dashed border-rule bg-paper px-2.5 py-2">
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-cream-2 px-2.5 py-1 text-[11px] text-ink-2"
            >
              {item}
              <button
                type="button"
                aria-label={`Quitar ${item}`}
                onClick={() => onRemove(item)}
                className="text-muted transition hover:text-ink"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <input
            aria-label={`Agregar ${label.toLowerCase()}`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                add();
              }
            }}
            placeholder={`+ Agregar ${label.toLowerCase().replace('alergias, intolerancias y gustos', '')}`}
            className="min-w-0 flex-1 bg-transparent px-0.5 py-1 text-[11px] text-ink outline-none placeholder:text-muted"
          />
          {draft && (
            <button
              type="button"
              onClick={add}
              className="text-[11px] font-semibold text-brand-primary hover:text-brand-primary-hover"
            >
              Agregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
