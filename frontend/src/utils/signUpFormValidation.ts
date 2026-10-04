import type { SignUpFormValuesType } from '../types/FormValuesType';
import { PWD_REGEX, EMAIL_REGEX, USER_REGEX } from './regex';

const signUpFormValidation = (
  changedProperty: keyof SignUpFormValuesType,
  value: string | boolean,
  password?: string,
): boolean => {
  if (changedProperty === 'email') {
    const validEmail = EMAIL_REGEX.test(value as string);
    return validEmail ? true : false;
  } else if (changedProperty === 'firstName') {
    const validFirstName = USER_REGEX.test(value as string);
    return validFirstName ? true : false;
  } else if (changedProperty === 'lastName') {
    const validLastName = USER_REGEX.test(value as string);
    return validLastName ? true : false;
  } else if (changedProperty === 'password') {
    const validPassword = PWD_REGEX.test(value as string);
    return validPassword ? true : false;
  } else if (changedProperty === 'confirmPassword') {
    const validConfirmPassword = PWD_REGEX.test(value as string) && password === value;
    return validConfirmPassword ? true : false;
  } else if (changedProperty === 'terms') {
    const validTerms = value;
    return validTerms ? true : false;
  }
  return false;
};

export default signUpFormValidation;
