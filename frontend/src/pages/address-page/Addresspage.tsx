import { useState, useRef } from 'react';

import { useUserContext } from 'contexts/user.context';
import AddressForm from 'components/address-form/AddressForm.component';
import Navbar from 'components/nav/Nav.component';
import AddressOptions from './AddressOptions.component';

import styles from './AddressPage.styles.module.css';
import { FaLocationArrow } from 'react-icons/fa';
import { AddressType } from 'types/AddressType';

const AddressPage = () => {
  const [isNewAddressModalOpen, setIsNewAddressModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const initialValuesRef = useRef<AddressType | null>(null);
  const { userInfo } = useUserContext();

  return (
    <>
      {isNewAddressModalOpen && <AddressForm editMode={false} setIsAddressModalOpen={setIsNewAddressModalOpen} />}
      {isEditAddressModalOpen && initialValuesRef.current && (
        <AddressForm
          editMode={true}
          setIsAddressModalOpen={setIsEditAddressModalOpen}
          initialValues={initialValuesRef.current}
        />
      )}
      <Navbar />
      <div className={styles['address-page-content']}>
        <div className={styles['main-heading']}>
          Manage Addresses <FaLocationArrow />
        </div>
        <button className={styles['add-new-address-button']} onClick={() => setIsNewAddressModalOpen((prev) => !prev)}>
          + Add new address
        </button>
        <div className={styles['addresses-wrapper']}>
          {userInfo?.address.map((option, idx) => (
            <div className={styles['address-container']} key={option._id}>
              <div className={styles['address-content']}>
                <span>
                  <span>
                    Name:&nbsp;
                    <span className="fw-500">{option.name}</span>
                  </span>
                  ,&nbsp;
                  <span className="fw-500"></span>
                </span>{' '}
                <span>
                  DNo:&nbsp;
                  <span className="fw-500">{option.line1}</span>
                </span>
                ,&nbsp;
                <span>
                  City:&nbsp;
                  <span className="fw-500">{option.city}</span>
                </span>
                ,&nbsp;
                <span>
                  State:&nbsp;
                  <span className="fw-500">{option.state}</span>
                </span>
                ,{' '}
                <span>
                  Pincode:
                  <span className="fw-500">{option.postalCode}</span>
                </span>
                &nbsp;&nbsp;&nbsp;
                <span className={styles['address-type']}>{option.addressType}</span>
              </div>
              <AddressOptions
                initialValuesRef={initialValuesRef}
                setIsEditAddressModalOpen={setIsEditAddressModalOpen}
                option={option}
                idx={idx}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddressPage;
