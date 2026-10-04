import React, { useState } from 'react';

import { AddressFormValuesType } from 'types/FormValuesType';
import { useUserContext } from 'contexts/user.context';
import { AddressType } from 'types/AddressType';

import styles from './AddressForm.styles.module.css';
import { IoClose } from 'react-icons/io5';

type AddressFormModalType = {
  editMode: boolean;
  setIsAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  initialValues?: AddressType;
};

type FormInputType = {
  name: keyof AddressFormValuesType;
  id: string;
  labelClassName: string;
  placeholder?: string;
  labelContent: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: 'text' | 'radio';
  value: string;
  inputClassName?: string;
  checked?: boolean;
};
const INITIAL_FORM_STATE: AddressFormValuesType = {
  addressType: '',
  city: '',
  country: '',
  line1: '',
  name: '',
  postalCode: '',
  state: '',
};
const setInitialState = (editMode: boolean, initialValues: AddressType | undefined) => {
  if (editMode && initialValues) {
    const { addressType, city, country, line1, name, postalCode, state } = initialValues;
    return {
      addressType,
      city,
      country,
      line1,
      name,
      postalCode,
      state,
    } as AddressFormValuesType;
  }
  return INITIAL_FORM_STATE;
};

export const FormInput = ({
  name,
  id,
  labelClassName,
  placeholder,
  labelContent,
  onChange,
  type,
  value,
  inputClassName,
  checked,
}: FormInputType) => {
  return (
    <>
      <label className={labelClassName} htmlFor={id}>
        {labelContent}
      </label>
      {checked !== undefined ? (
        <input
          name={name}
          id={id}
          type={type}
          checked={checked}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={inputClassName ? inputClassName : ''}
          required
        />
      ) : (
        <input
          name={name}
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={inputClassName ? inputClassName : ''}
          required
        />
      )}
    </>
  );
};

const AddressForm = ({ setIsAddressModalOpen, editMode, initialValues }: AddressFormModalType) => {
  const [formState, setFormState] = useState<AddressFormValuesType>(() => setInitialState(editMode, initialValues));
  const { addNewAddress, updateAddress, userInfo } = useUserContext();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.name;
    const value = event.target.value;
    if (key === 'postalCode' && value.length <= 6) {
      setFormState((prev) => ({ ...prev, [key]: value }));
    } else if (event.target.name !== 'postalCode') {
      setFormState((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsAddressModalOpen((prev) => !prev);
    if (editMode) {
      initialValues &&
        updateAddress({ ...formState, isDeliveryAddress: initialValues.isDeliveryAddress, _id: initialValues._id });
    } else if (!editMode) {
      userInfo?.address.length === 0
        ? addNewAddress({ ...formState, isDeliveryAddress: true } as AddressType)
        : addNewAddress({ ...formState, isDeliveryAddress: false } as AddressType);
    }
  };

  return (
    <div
      className={styles['address-form-wrapper']}
      onSubmit={handleSubmit}
      onClick={() => setIsAddressModalOpen((prev) => !prev)}
    >
      <dialog className={styles['address-form']} onClick={(e) => e.stopPropagation()} open aria-modal="true">
        <button
          className={styles['close-button']}
          type="button"
          onClick={() => setIsAddressModalOpen((prev) => !prev)}
          aria-label="close"
        >
          <span>
            <IoClose />
          </span>
        </button>
        <form>
          <FormInput
            name="name"
            id="name"
            type="text"
            value={formState ? formState.name : ''}
            placeholder="name"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="Name"
          />
          <FormInput
            name="line1"
            id="line1"
            type="text"
            value={formState ? formState.line1 : ''}
            placeholder="House No., Street"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="House no., Street/line"
          />
          <FormInput
            name="city"
            id="city"
            type="text"
            value={formState ? formState.city : ''}
            placeholder="city"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="City"
          />
          <FormInput
            name="state"
            id="state"
            type="text"
            value={formState ? formState.state : ''}
            placeholder="state"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="State"
          />
          <FormInput
            name="country"
            id="country"
            type="text"
            value={formState ? formState.country : ''}
            placeholder="country"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="Country"
          />
          <FormInput
            name="postalCode"
            id="postal-code"
            type="text"
            value={formState ? formState.postalCode : ''}
            placeholder="postal-code/ pin-code"
            onChange={handleChange}
            labelClassName="sr-only"
            labelContent="Postal code"
          />
          <div className={styles['address-type']}>
            <div className={styles['address-type-input']}>
              <FormInput
                name="addressType"
                id="type-home"
                type="radio"
                value="Home"
                checked={formState && formState.addressType === 'Home'}
                onChange={handleChange}
                labelClassName={'text-uppercase'}
                labelContent="home"
                inputClassName="custom-input"
              />
            </div>
            <div className={styles['address-type-input']}>
              <FormInput
                name="addressType"
                id="type-work"
                type="radio"
                value="Work"
                checked={formState && formState.addressType === 'Work'}
                onChange={handleChange}
                labelClassName={'text-uppercase'}
                labelContent="work"
                inputClassName="custom-input"
              />
            </div>
            <div className={styles['address-type-input']}>
              <FormInput
                name="addressType"
                id="type-guest"
                type="radio"
                value="Guest"
                checked={formState && formState.addressType === 'Guest'}
                onChange={handleChange}
                labelClassName={'text-uppercase'}
                labelContent="guest"
                inputClassName="custom-input"
              />
            </div>
          </div>
          <button type="submit" className={styles['save-button']}>
            Save
          </button>
        </form>
      </dialog>
    </div>
  );
};

export default AddressForm;
