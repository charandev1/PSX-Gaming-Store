export type SignUpFormValuesType = {
  firstName: string;
  lastName: string;
  terms: boolean;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AddressFormValuesType = {
  name: string | '';
  addressType: 'Home' | 'Work' | 'Guest' | '';
  postalCode: string | '';
  city: string | '';
  state: string | '';
  country: string | '';
  line1: string | '';
};
