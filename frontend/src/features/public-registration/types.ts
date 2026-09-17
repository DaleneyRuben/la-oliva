export interface RegistrationForm {
  firstName: string;
  lastName: string;
  sex: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  deliveryZone: string;
  preferredStartDate: string;
  weight: string;
  height: string;
  website: string;
  restrictions: string[];
  underlyingDiseases: string[];
  otherUnderlyingDisease: string;
  operations: string[];
  medications: string[];
}

export type ListField = 'restrictions' | 'operations' | 'medications';
export type RegistrationStep = 1 | 2 | 3;
export type UpdateRegistrationForm = (key: keyof RegistrationForm, value: string) => void;

export const createInitialRegistrationForm = (): RegistrationForm => ({
  firstName: '',
  lastName: '',
  sex: '',
  dateOfBirth: '',
  phoneNumber: '',
  address: '',
  deliveryZone: '',
  preferredStartDate: '',
  weight: '',
  height: '',
  website: '',
  restrictions: [],
  underlyingDiseases: [],
  otherUnderlyingDisease: '',
  operations: [],
  medications: [],
});
