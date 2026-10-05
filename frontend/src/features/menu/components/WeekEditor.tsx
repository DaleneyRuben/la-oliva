import { useEffect, useState } from 'react';
import { ConfirmModal } from '@ui/ConfirmModal';
import type { Menu, MenuDraft } from '@/features/menu/types';
import { countFilledMeals } from '@/features/menu/menuFields';
import { useWeekDraft } from '@/features/menu/hooks/useWeekDraft';
import { WeekEditGrid } from './WeekEditGrid';
import { MobileWeekEditor } from './MobileWeekEditor';
import { WeekSaveBar } from './WeekSaveBar';

interface Props {
  weekDays: string[];
  menus: Menu[];
  today: string;
  isSaving: boolean;
  onSave: (drafts: MenuDraft[]) => Promise<void>;
  onClose: () => void;
}

export function WeekEditor({ weekDays, menus, today, isSaving, onSave, onClose }: Props) {
  const week = useWeekDraft(weekDays, menus);
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const dirty = week.changeCount > 0;

  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const editorProps = {
    weekDays,
    drafts: week.drafts,
    today,
    isChanged: week.isChanged,
    onChange: week.setDish,
    onCopyPrevious: week.copyPreviousDay,
  };

  const handleSave = async () => {
    await onSave(week.changedDrafts);
    onClose();
  };

  return (
    <>
      <div className="hidden lg:block">
        <WeekEditGrid {...editorProps} />
      </div>
      <div className="lg:hidden">
        <MobileWeekEditor {...editorProps} />
      </div>

      <WeekSaveBar
        changeCount={week.changeCount}
        filledCount={week.drafts.reduce((sum, d) => sum + countFilledMeals(d), 0)}
        saving={isSaving}
        onDiscard={() => (dirty ? setConfirmingDiscard(true) : onClose())}
        onSave={handleSave}
      />

      {confirmingDiscard && (
        <ConfirmModal
          title="¿Descartar cambios?"
          message="Los cambios que no guardaste en esta semana se perderán."
          confirmLabel="Descartar cambios"
          onClose={() => setConfirmingDiscard(false)}
          onConfirm={async () => onClose()}
        />
      )}
    </>
  );
}
