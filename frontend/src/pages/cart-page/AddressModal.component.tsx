import React, { useEffect, useState } from 'react';
import styles from './AddressModal.styles.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { useUserContext } from 'contexts/user.context';
import { useAuthContext } from 'contexts/auth.context';
import { handleError } from 'utils/displayError';
import { showToastErrorMessage } from 'utils/toastMessage';
import { IoClose } from 'react-icons/io5';

type AddressModalType = {
  setIsAddressesModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsNewAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deliveryAddressId: string | null;
};

const AddressModal = ({ setIsAddressesModalOpen, setIsNewAddressModalOpen, deliveryAddressId }: AddressModalType) => {
  const { userInfo, setUserInfo } = useUserContext();
  const { useAxiosPrivate, clearAxiosInterceptors } = useAuthContext();
  const { axiosPrivate, requestInterceptor, responseInterceptor } = useAxiosPrivate();
  const [deliveryAddress, setDeliveryAddress] = useState<string | null>(deliveryAddressId);

  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

  const handleChange = async (newDeliveryAddress: string) => {
    try {
      const { data, status } = await axiosPrivate({
        url: 'user/address',
        method: 'PATCH',
        params: { delivery: newDeliveryAddress },
      });
      if (data.data.error) {
        showToastErrorMessage(data.message);
      }
      if (status === 200) {
        setDeliveryAddress(data.data.updatedItem);
        setIsAddressesModalOpen((prev) => !prev);
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                address: prev.address.map((option) =>
                  option._id === data.data.updatedItem
                    ? { ...option, isDeliveryAddress: true }
                    : { ...option, isDeliveryAddress: false },
                ),
              }
            : prev,
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className={styles['addresses-modal-container']} onClick={() => setIsAddressesModalOpen((prev) => !prev)}>
      <dialog className={styles['addresses-modal']} onClick={(e) => e.stopPropagation()} open aria-modal="true">
        <div className={styles['dialog-top-row']}>
          <span className={styles['addresses-modal-heading']}>
            Select Delivery Address <FaMapMarkerAlt />
          </span>
          <button
            type="button"
            className={styles['close-button']}
            onClick={() => setIsAddressesModalOpen((prev) => !prev)}
            aria-label="close"
          >
            <span>
              <IoClose />
            </span>
          </button>
        </div>
        <button onClick={() => setIsNewAddressModalOpen((prev) => !prev)} className={styles['add-new-address-button']}>
          + Add new Address
        </button>
        <form>
          {userInfo?.address.map((option, idx) => (
            <div className={styles['address-container']} key={option._id}>
              <input
                type="radio"
                checked={option._id === deliveryAddress}
                className={`custom-input ${styles['address-selector-button']}`}
                onChange={() => handleChange(option._id)}
                name="address"
                id={option.name + idx}
              />
              <label htmlFor={option.name + idx}>
                <div className={styles['address-details']}>
                  <span className="fw-500 heading-3">
                    {option.name}, {option.postalCode}
                  </span>{' '}
                  <span>
                    {option.line1}, {option.city}
                  </span>{' '}
                  <span className={styles['address-type']}>{option.addressType}</span>
                </div>
              </label>
            </div>
          ))}
        </form>
      </dialog>
    </div>
  );
};

export default AddressModal;
