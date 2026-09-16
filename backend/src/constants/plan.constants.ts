export const PLAN_UNAVAILABLE_MESSAGE = 'El plan seleccionado ya no está disponible.';

export const planHasSubscriptionsMessage = (count: number): string => {
  const subscriptionLabel =
    count === 1 ? 'suscripción actual o futura' : 'suscripciones actuales o futuras';
  return `No se puede eliminar este plan porque tiene ${count} ${subscriptionLabel}.`;
};
