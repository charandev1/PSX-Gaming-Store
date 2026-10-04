import { useState } from "react";
import axios from "axios";
import { useUserContext } from "./contexts/user.context";
import styles from "./AddAddress.module.css";

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

interface AddAddressProps {
  onClose: () => void;
  onAddressAdded: () => void;
  editMode?: boolean;
  initialValues?: Address | null;
}

const AddAddress = ({
  onClose,
  onAddressAdded,
  editMode = false,
  initialValues = null,
}: AddAddressProps) => {

  const { userInfo } = useUserContext();

  const [name, setName] = useState(initialValues?.name || "");
  const [line1, setLine1] = useState(initialValues?.line1 || "");
  const [city, setCity] = useState(initialValues?.city || "");
  const [state, setState] = useState(initialValues?.state || "");
  const [postalCode, setPostalCode] = useState(
    initialValues?.postalCode || ""
  );
  const [addressType, setAddressType] = useState(
    initialValues?.addressType || "Home"
  );

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      return;
    }

    if (
      !name ||
      !line1 ||
      !city ||
      !state ||
      !postalCode
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const addressData = {
        name,
        line1,
        city,
        state,
        postalCode,
        addressType,
      };

      if (editMode && initialValues) {

        // EDIT EXISTING ADDRESS
        await axios.put(
          `http://localhost:8080/address/${initialValues.id}`,
          addressData,
          {
            params: {
              userId: userInfo.id,
            },
          }
        );

      } else {

        // ADD NEW ADDRESS
        await axios.post(
          "http://localhost:8080/address",
          addressData,
          {
            params: {
              userId: userInfo.id,
            },
          }
        );
      }

      onAddressAdded();
      onClose();

    } catch (error) {

      console.error(
        editMode
          ? "Failed to update address:"
          : "Failed to add address:",
        error
      );

      alert(
        editMode
          ? "Failed to update address"
          : "Failed to add address"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>

      <div className={styles.modal}>

        {/* HEADER */}

        <div className={styles.header}>

          <h2>
            {editMode
              ? "Edit Address"
              : "Add New Address"}
          </h2>

          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* FORM */}

        <form onSubmit={handleSubmit}>

          <div className={styles.formGroup}>
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>


          <div className={styles.formGroup}>
            <label>Address / D.No</label>

            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              placeholder="Enter house number / street"
            />
          </div>


          <div className={styles.formGroup}>
            <label>City</label>

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
            />
          </div>


          <div className={styles.formGroup}>
            <label>State</label>

            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="Enter state"
            />
          </div>


          <div className={styles.formGroup}>
            <label>Pincode</label>

            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Enter pincode"
              maxLength={6}
            />
          </div>


          <div className={styles.formGroup}>
            <label>Address Type</label>

            <select
              value={addressType}
              onChange={(e) => setAddressType(e.target.value)}
            >
              <option value="Home">Home</option>
              <option value="Work">Work</option>
              <option value="Other">Other</option>
            </select>
          </div>


          {/* BUTTONS */}

          <div className={styles.buttons}>

            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : editMode
                  ? "Update Address"
                  : "Save Address"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddAddress;