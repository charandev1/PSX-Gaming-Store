import { useEffect, useState } from "react";
import { FaLocationArrow, FaEdit, FaTrash } from "react-icons/fa";
import api from "./api";

import styles from "./AddressPage.module.css";
import { useUserContext } from "./contexts/user.context";
import AddAddress from "./AddAddress";
import HomePageBody from "./HomePageBody";

interface Address {
  id: number;
  userId: number;
  name: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  addressType: string;
}

const AddressPage = () => {

  const { userInfo } = useUserContext();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);

const [selectedAddress, setSelectedAddress] =
  useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] =
  useState<number | null>(() => {
    const savedAddressId = localStorage.getItem("selectedAddressId");

    return savedAddressId ? Number(savedAddressId) : null;
  });
  useEffect(() => {

    if (!userInfo) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    api
  .get("/address", {
    params: {
      userId: userInfo.id,
    },
  })
  .then((res) => {
    setAddresses(res.data);
  })
  .catch((error) => {
    console.error("Failed to fetch addresses:", error);
  })
  .finally(() => {
    setLoading(false);
  });

}, [userInfo]);

  const handleDeleteAddress = async (addressId: number) => {
  if (!userInfo) return;

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmDelete) return;

  try {
   await api.delete(`/address/${addressId}`, {
  params: {
    userId: userInfo.id,
  },
});

    // Remove the deleted address from the UI
    setAddresses((prev) =>
  prev.filter((address) => address.id !== addressId)
);

if (selectedAddressId === addressId) {
  setSelectedAddressId(null);
  localStorage.removeItem("selectedAddressId");
}

  } catch (error) {
    console.error("Failed to delete address:", error);
    alert("Failed to delete address");
  }
};
const handleEditAddress = (address: Address) => {
  setSelectedAddress(address);
  setIsEditAddressOpen(true);
};
const handleSelectAddress = (addressId: number) => {
  setSelectedAddressId(addressId);

  localStorage.setItem(
    "selectedAddressId",
    addressId.toString()
  );
};

  return (
      <>
       <HomePageBody />
    {isAddAddressOpen && (
  <AddAddress
    onClose={() => setIsAddAddressOpen(false)}
    onAddressAdded={() => {
      if (!userInfo) return;

     api
  .get("/address", {
    params: {
      userId: userInfo.id,
    },
  })
  .then((res) => {
    setAddresses(res.data);
  })
  .catch((error) => {
    console.error("Failed to refresh addresses:", error);
  });
    }}
  />
)}{isEditAddressOpen && selectedAddress && (
  <AddAddress
    editMode={true}
    initialValues={selectedAddress}
    onClose={() => {
      setIsEditAddressOpen(false);
      setSelectedAddress(null);
    }}
    onAddressAdded={() => {

      if (!userInfo) return;

      api
  .get("/address", {
    params: {
      userId: userInfo.id,
    },
  })
  .then((res) => {
    setAddresses(res.data);
  })
  .catch((error) => {
    console.error(
      "Failed to refresh addresses:",
      error
    );
  });
    }}
  />
)}
    <div className={styles.addressPage}>

      {/* PAGE HEADING */}
      <div className={styles.heading}>
        <h1>
          Manage Addresses
          <FaLocationArrow />
        </h1>
      </div>


      {/* ADD BUTTON */}
     <button
  className={styles.addButton}
  onClick={() => setIsAddAddressOpen(true)}
>
  + Add New Address
</button>

      {/* LOADING */}
      {loading && (
        <p className={styles.message}>
          Loading addresses...
        </p>
      )}


      {/* NO ADDRESSES */}
      {!loading && addresses.length === 0 && (
        <p className={styles.message}>
          You don't have any saved addresses.
        </p>
      )}


      {/* ADDRESS LIST */}
      <div className={styles.addressesWrapper}>

        {addresses.map((address) => (

          <div
  className={`${styles.addressContainer} ${
    selectedAddressId === address.id
      ? styles.selectedAddress
      : ""
  }`}
  key={address.id}
>
         <div className={styles.addressSelect}>
  <input
    type="radio"
    name="selectedAddress"
    checked={selectedAddressId === address.id}
    onChange={() => handleSelectAddress(address.id)}
  />

  <span>Select</span>
</div>
            <div className={styles.addressContent}>

              <div>
                <strong>Name:</strong>{" "}
                {address.name}
              </div>

              <div>
                <strong>Address:</strong>{" "}
                {address.line1}
              </div>

              <div>
                <strong>City:</strong>{" "}
                {address.city}
              </div>

              <div>
                <strong>State:</strong>{" "}
                {address.state}
              </div>

              <div>
                <strong>Pincode:</strong>{" "}
                {address.postalCode}
              </div>

              <span className={styles.addressType}>
                {address.addressType}
              </span>

            </div>


            {/* OPTIONS */}
            <div className={styles.addressOptions}>

              <button
  className={styles.editButton}
  onClick={() => handleEditAddress(address)}
>
  <FaEdit />
  Edit
</button>
<button
  className={styles.deleteButton}
  onClick={() => handleDeleteAddress(address.id)}
>
  <FaTrash />
  Delete
</button>
            </div>

          </div>

        ))}

      </div>

    </div>
    </>
  );
};

export default AddressPage;