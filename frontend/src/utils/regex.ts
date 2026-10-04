export const EMAIL_REGEX = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$');
export const USER_REGEX = new RegExp('^[a-zA-z][A-z0-9-_]{3,23}$');
export const PWD_REGEX = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$');
