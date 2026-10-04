import { useState } from 'react';

import { useUserContext } from 'contexts/user.context';
import { AddressType } from 'types/AddressType';

import styles from './AddressPage.styles.module.css';

type AddressOptionsType = {
  initialValuesRef: React.MutableRefObject<AddressType | null>;
  setIsEditAddressModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  option: AddressType;
  idx: number;
};

const AddressOptions = ({ initialValuesRef, setIsEditAddressModalOpen, option, idx }: AddressOptionsType) => {
  const [displayAddressOptions, setDisplayAddressOptions] = useState(false);
  const { userInfo, deleteAddress } = useUserContext();

  return userInfo ? (
    <div className={styles['address-options-wrapper']}>
      <button
        aria-label="address options toggle"
        className={styles['address-options-button']}
        onClick={() => setDisplayAddressOptions((prev) => !prev)}
      >
        &#10247;
      </button>
      {displayAddressOptions && (
        <div className={styles['address-options']}>
          <button
            onClick={() => {
              initialValuesRef.current = userInfo.address[idx];
              setIsEditAddressModalOpen(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => deleteAddress(option._id)}>Delete</button>
        </div>
      )}
    </div>
  ) : null;
};

export default AddressOptions;
