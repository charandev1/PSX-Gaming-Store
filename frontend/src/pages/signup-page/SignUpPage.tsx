import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import FormInput from 'components/formInput/FormInput.component';
import { showToastInfoMessage, showToastSuccessMessage, showToastErrorMessage } from 'utils/toastMessage';
import signUpFormValidation from 'utils/signUpFormValidation';
import { SignUpFormValuesType } from 'types/FormValuesType';

import { FaInfoCircle } from 'react-icons/fa';
import styles from './SignUp.styles.module.css';

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  terms: false,
  email: '',
  password: '',
  confirmPassword: '',
};
type FormValidValueType = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  terms: boolean;
};
type FormInputFocusType = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

type InvalidNotePropsType = {
  id: string;
  children: React.ReactNode;
};

const InvalidNote = ({ id, children }: InvalidNotePropsType) => {
  return (
    <div className={styles.invalidValueNote}>
      <FaInfoCircle style={{ minWidth: '20px' }} />
      <p id={id}>{children}</p>
    </div>
  );
};

const SignUp = () => {
  const [formState, setFormState] = useState<SignUpFormValuesType>(INITIAL_STATE);
  const [formValidValue, setFormValidValue] = useState({} as FormValidValueType);
  const [formInputFocus, setFormInputFocus] = useState({} as FormInputFocusType);
  const inputLabelStyle = {
    display: 'grid',
    gridTemplateColumns: '1em auto',
    gap: '0.5em',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const navigate = useNavigate();
  const allValidValues = Object.entries(formValidValue).reduce((prev, curr) => prev && curr[1], true);

  const handleInputFocus = (changedProperty: keyof FormInputFocusType, isFocus: boolean) => {
    setFormInputFocus({ ...formInputFocus, [changedProperty]: isFocus });
  };

  const displayInvalidValueNote = (changedProperty: keyof FormInputFocusType): boolean => {
    return (
      (!formValidValue[changedProperty] && formState[changedProperty].length > 0) ||
      (formInputFocus[changedProperty] && formState[changedProperty].length > 0 && !formValidValue[changedProperty])
    );
  };

  const handleFormInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    changedProperty: keyof typeof formState | keyof FormValidValueType,
  ) => {
    if (changedProperty === 'terms') {
      const isFormValueValid = signUpFormValidation(changedProperty, event.target.checked);
      setFormValidValue({ ...formValidValue, [changedProperty]: isFormValueValid });
      setFormState((prevState) => ({ ...prevState, [changedProperty]: event.target.checked }));
    } else {
      if (changedProperty === 'confirmPassword') {
        const isFormValueValid = signUpFormValidation(changedProperty, event.target.value, formState.password);
        setFormValidValue({ ...formValidValue, [changedProperty]: isFormValueValid });
      } else {
        const isFormValueValid = signUpFormValidation(changedProperty, event.target.value);
        setFormValidValue({ ...formValidValue, [changedProperty]: isFormValueValid });
      }
      setFormState((prevState) => ({ ...prevState, [changedProperty]: event.target.value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const { firstName, lastName, email, password } = form.elements as typeof form.elements & {
      firstName: HTMLInputElement;
      lastName: HTMLInputElement;
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const { data, status } = await axios.post('register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    if (status === 409) {
      showToastErrorMessage(data.message);
    }
    if (status === 201) {
      showToastInfoMessage(`Redirecting to SignIn page`);
      showToastSuccessMessage(data.message);
      setTimeout(() => {
        navigate('/signin');
      }, 4000);
    }
  };

  return (
    <div className={styles.signUpWrapper}>
      <h1 className="text-uppercase">sign up</h1>
      <section className={styles.signUpContainer}>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Firstname"
            type="text"
            id="firstName"
            value={formState.firstName}
            name="firstName"
            required={true}
            onChange={(event) => handleFormInputChange(event, 'firstName')}
            autoComplete="off"
            ariaInvalid={!formValidValue.firstName}
            ariaDescribedBy="f-nidnote"
            onFocus={() => handleInputFocus('firstName', true)}
            onBlur={() => handleInputFocus('firstName', false)}
          />
          {displayInvalidValueNote('firstName') && (
            <InvalidNote id="l-nidnote">
              4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
            </InvalidNote>
          )}
          <FormInput
            label="Lastname"
            type="text"
            id="lastName"
            value={formState.lastName}
            name="lastName"
            required={true}
            onChange={(event) => handleFormInputChange(event, 'lastName')}
            autoComplete="off"
            ariaInvalid={!formValidValue.lastName}
            ariaDescribedBy="l-nidnote"
            onFocus={() => handleInputFocus('lastName', true)}
            onBlur={() => handleInputFocus('lastName', false)}
          />
          {displayInvalidValueNote('lastName') && (
            <InvalidNote id="l-nidnote">
              4 to 24 characters. Must begin with a letter. Letters, numbers, underscores, hyphens allowed.
            </InvalidNote>
          )}
          <FormInput
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={(event) => handleFormInputChange(event, 'email')}
            required={true}
            autoComplete="off"
            ariaInvalid={!formValidValue.email}
            ariaDescribedBy="email-idnote"
            onFocus={() => handleInputFocus('email', true)}
            onBlur={() => handleInputFocus('email', false)}
          />
          {displayInvalidValueNote('email') && (
            <InvalidNote id="email-idnote">
              Your entered email should look like this <strong style={{ color: 'black' }}>example@test.com</strong>
            </InvalidNote>
          )}
          <FormInput
            label="Password"
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={(event) => handleFormInputChange(event, 'password')}
            required={true}
            autoComplete="off"
            ariaInvalid={!formValidValue.password}
            ariaDescribedBy="pwd-idnote"
            onFocus={() => handleInputFocus('password', true)}
            onBlur={() => handleInputFocus('password', false)}
          />
          {displayInvalidValueNote('password') && (
            <InvalidNote id="pwd-idnote">
              8 to 24 characters. Must include uppercase and lowercase letters, a number and a special character.
              Allowed special characters: <span aria-label="exclamation mark">!</span>{' '}
              <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span>{' '}
              <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
            </InvalidNote>
          )}
          <FormInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formState.confirmPassword}
            onChange={(event) => handleFormInputChange(event, 'confirmPassword')}
            required={true}
            autoComplete="off"
            ariaInvalid={!formValidValue.confirmPassword}
            ariaDescribedBy="c-pwd-idnote"
            onFocus={() => handleInputFocus('confirmPassword', true)}
            onBlur={() => handleInputFocus('confirmPassword', false)}
          />
          {displayInvalidValueNote('confirmPassword') && (
            <InvalidNote id="c-pwd-idnote">Must match the first password input field.</InvalidNote>
          )}
          <label className={styles.terms} htmlFor="checkbox" style={inputLabelStyle}>
            <input
              type="checkbox"
              required
              checked={formState.terms}
              onChange={(event) => handleFormInputChange(event, 'terms')}
              id="terms"
              name="terms"
              aria-invalid={!formValidValue.terms}
            />
            I accept Terms & Conditions
          </label>
          <button
            disabled={!allValidValues}
            className={`${styles.signUpBtn}
                     ${!allValidValues && styles.disabled}`}
          >
            Sign Up
          </button>
        </form>
      </section>
    </div>
  );
};

export default SignUp;
