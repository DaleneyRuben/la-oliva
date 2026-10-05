import { addDays, format } from 'date-fns';
import { useState } from 'react';
import { Button } from '@ui/Button';
import { PageHeader } from '@ui/PageHeader';
import { Tabs } from '@ui/Tabs';
import { useMenu } from '@/features/menu/hooks/useMenu';
import { getMenuWeeks, isPastDay, weekRangeLabel } from '@/features/menu/menuWeeks';
import { DayStatusCard } from '@/features/menu/components/DayStatusCard';
import { MenuImportSkeleton } from '@/features/menu/components/MenuImportSkeleton';
import { WeekEditor } from '@/features/menu/components/WeekEditor';
import { WeekGrid } from '@/features/menu/components/WeekGrid';

const WEEK_TABS = [
  { id: '0', label: 'Esta semana' },
  { id: '1', label: 'Próxima semana' },
];

const toIso = (d: Date) => format(d, 'yyyy-MM-dd');

function dayTag(date: string, today: string, tomorrow: string) {
  if (date === today) return 'Hoy';
  if (date === tomorrow) return 'Mañana';
  return undefined;
}

export function MenuImportPage() {
  const now = new Date();
  const today = toIso(now);
  const tomorrow = toIso(addDays(now, 1));
  const weeks = getMenuWeeks(now);

  const [weekIndex, setWeekIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const { menus, isLoading, isSaving, saveWeek } = useMenu();

  const weekDays = weeks[weekIndex];
  const allPast = weekDays.every((date) => isPastDay(date, today));

  return (
    <div className="px-4 py-5 lg:px-[44px] lg:pt-[34px] lg:pb-0">
      <PageHeader
        label="Operativa diaria"
        title={editing ? 'Editar semana' : 'Menú semanal'}
        action={
          !editing && !isLoading && !allPast ? (
            <Button leftIcon="pencil" onClick={() => setEditing(true)}>
              Editar semana
            </Button>
          ) : undefined
        }
      />

      {isLoading && <MenuImportSkeleton />}

      {!isLoading && (
        <div className="flex flex-wrap items-end justify-between gap-4 mb-[18px]">
          {editing ? (
            <p className="text-[13.5px] font-semibold text-ink-2">{WEEK_TABS[weekIndex].label}</p>
          ) : (
            <Tabs
              tabs={WEEK_TABS}
              activeId={String(weekIndex)}
              onChange={(id) => setWeekIndex(Number(id))}
            />
          )}
          <span className="font-mono text-[11.5px] tracking-[.04em] text-muted">
            {weekRangeLabel(weekDays)}
          </span>
        </div>
      )}

      {!isLoading && editing && (
        <WeekEditor
          weekDays={weekDays}
          menus={menus}
          today={today}
          isSaving={isSaving}
          onSave={async (drafts) => {
            await saveWeek(drafts);
          }}
          onClose={() => setEditing(false)}
        />
      )}

      {!isLoading && !editing && (
        <div className="pb-5 lg:pb-[34px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-[22px]">
            {weekDays.map((date) => (
              <DayStatusCard
                key={date}
                date={date}
                menu={menus.find((m) => m.date === date) ?? null}
                tag={dayTag(date, today, tomorrow)}
                isPast={isPastDay(date, today)}
                onEdit={() => setEditing(true)}
              />
            ))}
          </div>
          <WeekGrid weekDays={weekDays} menus={menus} today={today} />
        </div>
      )}
    </div>
  );
}
