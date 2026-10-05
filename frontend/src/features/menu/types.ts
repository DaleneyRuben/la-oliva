import type { MealField } from '@/features/menu/menuFields';

export interface Menu {
  id: string;
  date: string;
  breakfast: string | null;
  morningSnack: string | null;
  salad: string | null;
  lunch: string | null;
  afternoonSnack: string | null;
  dinner: string | null;
  juice: string | null;
}

export type MenuDraft = Omit<Menu, 'id'>;

// Shared by the desktop grid and the phone editor, which edit the same week draft.
export interface WeekDraftEditorProps {
  weekDays: string[];
  drafts: MenuDraft[];
  today: string;
  isChanged: (date: string, field: MealField) => boolean;
  onChange: (date: string, field: MealField, value: string) => void;
  onCopyPrevious: (date: string) => void;
}
