import { Button } from '@ui/Button';
import { MEAL_FIELDS } from '@/features/menu/menuFields';

interface Props {
  changeCount: number;
  filledCount: number;
  saving: boolean;
  onDiscard: () => void;
  onSave: () => void;
}

function changesLabel(count: number): string {
  if (count === 0) return 'Sin cambios';
  return count === 1 ? '1 cambio sin guardar' : `${count} cambios sin guardar`;
}

export function WeekSaveBar({ changeCount, filledCount, saving, onDiscard, onSave }: Props) {
  const total = MEAL_FIELDS.length * 5;
  return (
    <div className="sticky bottom-0 z-20 -mx-4 lg:-mx-[44px] mt-6 px-4 lg:px-[44px] py-[14px] bg-paper border-t border-rule shadow-[var(--shadow-save-bar)] flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-[10px] text-[13.5px]">
        <span
          aria-hidden="true"
          className={`w-[9px] h-[9px] rounded-full ${changeCount > 0 ? 'bg-warn-dot' : 'bg-muted-dot'}`}
        />
        <span className="font-semibold text-ink">{changesLabel(changeCount)}</span>
        <span aria-hidden="true" className="hidden sm:inline text-muted">
          ·
        </span>
        <span className="hidden sm:inline text-muted tabular-nums">
          {`${filledCount} de ${total} tiempos cargados`}
        </span>
      </div>
      <div className="flex gap-[10px] ml-auto">
        <Button variant="secondary" onClick={onDiscard} disabled={saving}>
          Descartar
        </Button>
        <Button leftIcon="check" onClick={onSave} loading={saving} disabled={changeCount === 0}>
          Guardar semana
        </Button>
      </div>
    </div>
  );
}
