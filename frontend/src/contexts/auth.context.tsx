import { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios, { AxiosHeaders } from 'axios';
import type { AxiosInstance } from 'axios';

import type ProviderPropsType from '../types/ProviderPropsType';
import { axiosPrivate } from '../api/axios';
import usePersist from '../hooks/usePersist';

import { showToastErrorMessage, showToastInfoMessage } from '../utils/toastMessage';

type AuthContextType = {
      useAxiosPrivate: () => {
        axiosPrivate: AxiosInstance;
        responseInterceptor: number;
        requestInterceptor: number;
      };
      signedIn: boolean;
      setSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
      accessToken: string | null;
      setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
      clearPersist: any;
      clearAxiosInterceptors: (responseInterceptor: number, requestInterceptor: number) => void;
    }
  | undefined;

const AuthContext = createContext<AuthContextType>(undefined);

export const AuthProvider = ({ children }: ProviderPropsType) => {
  const [signedIn, setSignedIn, clearPersist] = usePersist();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const onMountRef = useRef(false);

  const refresh = async () => {
    try {
      const { data } = await axios.get('refresh', {
        withCredentials: true,
      });
      setAccessToken(data.data.accessToken);
      return data.data.accessToken;
    } catch (error) {
      setSignedIn(false);
      showToastInfoMessage('SignIn again to continue.');
      showToastErrorMessage('Seems like your session expired!');
    }
  };

  useEffect(() => {
    if (signedIn && !onMountRef.current) {
      (async function getInitialAccessToken() {
        const newAccessToken = await refresh();
        setAccessToken(newAccessToken);
      })();
    }
    return () => {
      onMountRef.current = true;
    };
  }, [signedIn, refresh]);

  const useAxiosPrivate = () => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (config.headers && !(config.headers as AxiosHeaders).has('Authorization')) {
          (config.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`);
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          setAccessToken(newAccessToken);
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(error);
      },
    );

    return { axiosPrivate, responseInterceptor, requestInterceptor };
  };

  const clearAxiosInterceptors = (responseInterceptor: number, requestInterceptor: number) => {
    axiosPrivate.interceptors.response.eject(responseInterceptor);
    axiosPrivate.interceptors.request.eject(requestInterceptor);
  };

  const value = {
    useAxiosPrivate,
    accessToken,
    setAccessToken,
    signedIn,
    setSignedIn,
    clearPersist,
    clearAxiosInterceptors,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthProvider');
  }
  return context;
}
