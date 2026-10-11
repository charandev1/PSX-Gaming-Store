import React, { useState, createContext, useEffect } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import type ProviderPropsType from '../types/ProviderPropsType';
import { handleError } from '../utils/displayError';
import { useAuthContext } from '../contexts/auth.context';
import type { AddressType } from '../types/AddressType';
import {
  showToastSuccessMessage,
  showToastErrorMessage,
} from '../utils/toastMessage';
type UserInfoType = {
  id: number;
  email: string;
  name: string;
  address?: AddressType[]; // ✅ optional
};

export type UserContextValueType = {
      userSignInHandler: (email: string, password: string) => void;
      userInfo: UserInfoType | null;
      addNewAddress: (newAddress: AddressType) => void;
      updateAddress: (updatedAddress: AddressType) => void;
      deleteAddress: (addressId: string) => void;
      setUserInfo: React.Dispatch<React.SetStateAction<UserInfoType | null>>;
      userSignOutHandler: () => void;
      loading: boolean;
    }
  | undefined;

const UserContext = createContext<UserContextValueType>(undefined);

export const UserProvider = ({ children }: ProviderPropsType) => {
  const { useAxiosPrivate, clearPersist, setSignedIn, setAccessToken, clearAxiosInterceptors } =
    useAuthContext();
 const [userInfo, setUserInfo] =
  useState<UserInfoType | null>(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Failed to restore user:", error);
      localStorage.removeItem("user");
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const { axiosPrivate, requestInterceptor, responseInterceptor } = useAxiosPrivate();
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      clearAxiosInterceptors(responseInterceptor, requestInterceptor);
    };
  }, [clearAxiosInterceptors, requestInterceptor, responseInterceptor]);

 
const userSignInHandler = async (email: string, password: string) => {
  setLoading(true);

  try {
    const { data } = await api.post("/user/auth", {
      email,
      password,
    });

    setSignedIn(true);
    setUserInfo(data);

    localStorage.setItem("user", JSON.stringify(data));

    showToastSuccessMessage("Login successful");
    navigate("/");
  } catch (error: any) {
    console.error(error);

    const message = error.response?.data?.message;

    if (message === "User not found") {
      showToastErrorMessage("User not registered");
    } else if (message === "Invalid password") {
      showToastErrorMessage("Invalid password");
    } else {
      showToastErrorMessage("Login failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};


  const addNewAddress = async (newAddress: AddressType) => {
    try {
      const { data, status } = await axiosPrivate({
        url: 'user/address',
        method: 'POST',
        data: { ...newAddress },
      });
      if (status === 200) {
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                address: [...data.data.address],
              }
            : prev,
        );
        showToastSuccessMessage(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const updateAddress = async (updatedAddress: AddressType) => {
    try {
      const { data, status } = await axiosPrivate({
        url: 'user/address',
        method: 'PATCH',
        data: { ...updatedAddress },
      });
      if (status === 200) {
        showToastSuccessMessage(data.message);
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                address: prev.address?.map((option) => (option._id === data.data.updatedItem ? updatedAddress : option)),
              }
            : prev,
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      const { data, status } = await axiosPrivate({
        url: 'user/address',
        method: 'DELETE',
        data: { addressId },
      });
      if (status === 200) {
        showToastSuccessMessage(data.message);
        setUserInfo((prev) =>
          prev
            ? {
                ...prev,
                address: prev.address?.filter((option) => option._id !== data.data.removedItem),
              }
            : prev,
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  
const userSignOutHandler = () => {
  try {
    clearPersist();
    setSignedIn(false);
    setAccessToken(null);

    localStorage.removeItem("user");
    setUserInfo(null);

    showToastSuccessMessage("Signed out successfully");
    navigate("/", { replace: true });
  } catch (error) {
    console.error("Sign out failed:", error);
    showToastErrorMessage("Failed to sign out");
  }
};


  const value = {
    userSignInHandler,
    userInfo,
    addNewAddress,
    updateAddress,
    deleteAddress,
    setUserInfo,
    userSignOutHandler,
    loading,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUserContext() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}
