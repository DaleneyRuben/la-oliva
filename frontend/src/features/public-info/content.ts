import almuerzo from '@/assets/public-info/almuerzo.jpg';
import cena from '@/assets/public-info/cena.jpg';
import desayuno from '@/assets/public-info/desayuno.jpg';
import ensalada from '@/assets/public-info/ensalada.jpg';
import jugo from '@/assets/public-info/jugo.jpg';
import lunchDinnerPlan from '@/assets/public-info/lunch-dinner-plan.webp';
import lunchOnlyPlan from '@/assets/public-info/lunch-only-plan.webp';
import meriendaAm from '@/assets/public-info/merienda-am.jpg';
import meriendaPm from '@/assets/public-info/merienda-pm.jpg';

// Every string here is copied from the manager's information slides (design/public-info/slides).
// Only three spellings were corrected: "experiencias", "personalizado" and "días".

export type PublicTone = 'terracotta' | 'terracotta-deep' | 'olive' | 'orange' | 'plum';

export interface PublicSectionLink {
  id: string;
  label: string;
  icon: string;
  tone: PublicTone;
}

export const SECTION_LINKS: PublicSectionLink[] = [
  { id: 'plan-completo', label: 'Plan completo', icon: 'file-text', tone: 'terracotta' },
  { id: 'que-incluye', label: 'Qué incluye', icon: 'cloche', tone: 'terracotta-deep' },
  { id: 'tipos-de-plan', label: 'Tipos de plan', icon: 'leaf', tone: 'olive' },
  { id: 'precios', label: 'Precios', icon: 'tag', tone: 'orange' },
  { id: 'entregas', label: 'Entregas', icon: 'truck', tone: 'plum' },
];

export interface MealCard {
  label: string;
  image: string;
  alt: string;
}

export const MEALS: MealCard[] = [
  { label: 'Desayuno', image: desayuno, alt: 'Desayuno: bowl de avena con frutas' },
  { label: 'Merienda AM', image: meriendaAm, alt: 'Merienda AM: yogur con frutas' },
  { label: 'Ensalada', image: ensalada, alt: 'Ensalada fresca con vegetales' },
  { label: 'Almuerzo', image: almuerzo, alt: 'Almuerzo: proteína con arroz y vegetales' },
  { label: 'Merienda PM', image: meriendaPm, alt: 'Merienda PM: bocados de avena' },
  { label: 'Cena', image: cena, alt: 'Cena: pollo con vegetales' },
  { label: 'Jugo vitamínico', image: jugo, alt: 'Jugo vitamínico de frutas' },
];

export const PLAN_INCLUDES: string[] = [
  'Alimentación completa durante 20 días',
  'Servicio de lunes a viernes',
  '5 o 6 comidas diarias + jugo vitamínico',
  'Menú personalizado según tus objetivos y gustos',
  'Comidas caseras y variadas',
  'Envío a domicilio incluido en La Paz',
  'Entregas a partir de las 07:00 am',
  'Puedes consumir la comida al momento de la entrega o almacenarla',
];

export interface BeforeStartingCard {
  title: string;
  detail: string;
  emphasis: boolean;
  icon: string;
  tone: PublicTone;
}

export const BEFORE_STARTING: BeforeStartingCard[] = [
  { title: 'Anamnesis virtual', detail: 'Gratis', emphasis: true, icon: 'monitor', tone: 'olive' },
  {
    title: 'Evaluación presencial',
    detail: 'Bs. 50',
    emphasis: true,
    icon: 'user',
    tone: 'orange',
  },
  {
    title: 'Pago antes de iniciar',
    detail: 'mediante transferencia, depósito o QR',
    emphasis: false,
    icon: 'credit-card',
    tone: 'terracotta',
  },
];

export interface PlanType {
  name: string;
  meals: string;
  icon: string;
  tone: PublicTone;
}

export const PLAN_TYPES: PlanType[] = [
  { name: 'Reductor', meals: '5 comidas', icon: 'leaf', tone: 'olive' },
  { name: 'A medida', meals: '5 comidas', icon: 'scales', tone: 'orange' },
  { name: 'Incremento de masa', meals: '6 comidas', icon: 'dumbbell', tone: 'orange' },
  { name: 'Tratamiento médico', meals: '5 comidas', icon: 'heartbeat', tone: 'terracotta' },
  { name: 'Futura mamá o lactante', meals: '6 comidas', icon: 'mother', tone: 'terracotta' },
];

export interface PlanImage {
  src: string;
  alt: string;
}

// The manager's flyers behind "Además contamos con plan de Almuerzos y/o Cena", in that order.
export const LUNCH_DINNER_PLAN_IMAGES: PlanImage[] = [
  { src: lunchOnlyPlan, alt: 'Plan Solo Almuerzo' },
  { src: lunchDinnerPlan, alt: 'Plan Almuerzo + Cena' },
];

export interface PriceCard {
  title: string;
  price: string;
}

export const PRICES: PriceCard[] = [
  { title: '5 comidas + jugo', price: 'Bs. 1.450' },
  { title: '6 comidas + jugo', price: 'Bs. 1.550' },
];

export const PRICE_NOTES = [
  { icon: 'truck', text: 'Incluye envío en la ciudad de La Paz. Laderas con costo extra.' },
  { icon: 'calendar', text: 'La fecha de inicio la decides tú.' },
];

export const STEPS = [
  { icon: 'whatsapp', text: 'Nos contactas por WhatsApp' },
  { icon: 'clipboard-check', text: 'Realizamos anamnesis virtual o evaluación presencial' },
  { icon: 'settings', text: 'Personalizamos tu plan' },
  { icon: 'truck', text: 'Comenzamos con tus entregas' },
];

export const NOTICES = [
  {
    icon: 'chat',
    text: 'Las modificaciones de alimentación o envío se coordinan vía mensajes de WhatsApp, no llamadas.',
  },
  {
    icon: 'clock',
    text: 'Para suspender una entrega debes avisar con un mínimo de 24 horas antes.',
  },
  {
    icon: 'user',
    text: 'Es responsabilidad del cliente estar atento a la entrega o coordinar adecuadamente la recepción.',
  },
  { icon: 'file-text', text: 'Una vez hecho el pago no se aceptan devoluciones.' },
];

export const TONE_BG: Record<PublicTone, string> = {
  terracotta: 'bg-public-terracotta',
  'terracotta-deep': 'bg-public-terracotta-deep',
  olive: 'bg-public-olive',
  orange: 'bg-public-orange',
  plum: 'bg-public-plum',
};

export const TONE_TEXT: Record<PublicTone, string> = {
  terracotta: 'text-public-terracotta',
  'terracotta-deep': 'text-public-terracotta-deep',
  olive: 'text-public-olive',
  orange: 'text-public-orange',
  plum: 'text-public-plum',
};
