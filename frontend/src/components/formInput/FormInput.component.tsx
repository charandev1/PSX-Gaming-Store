import React from 'react';

import styles from './FormInput.styles.module.css';

type FormInputPropsType = {
  label: string;
  id: string;
  value: string;
  type: 'email' | 'password' | 'text';
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => any;
  required: boolean;
  disabled?: boolean;
  name?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
  onFocus?: () => any;
  onBlur?: () => any;
};

const FormInput = ({ label, value, ariaInvalid, ariaDescribedBy, ...otherProps }: FormInputPropsType) => {
  return (
    <div className={styles.group}>
      <input
        value={value}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        className={styles.formInput}
        {...otherProps}
      />
      {label && (
        <label htmlFor={otherProps.id} className={`${value?.length ? styles.shrink : ''} ${styles.formInputLabel}`}>
          {label}
        </label>
      )}
    </div>
  );
};

export default FormInput;
