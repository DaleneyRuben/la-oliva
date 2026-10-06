/**
 * Business WhatsApp number in international format without the leading "+", as wa.me expects it.
 * Empty until the manager provides it: wa.me then opens WhatsApp without a preselected chat.
 */
export const WHATSAPP_PHONE = '';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`;
