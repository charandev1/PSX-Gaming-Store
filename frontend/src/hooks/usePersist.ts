import { useState, useEffect } from 'react';

const getPersistedValue = () => {
  const value = localStorage.getItem('persist');
  if (typeof value === 'string') {
    return JSON.parse(value);
  }
  return false;
};

const usePersist = () => {
  const [persist, setPersist] = useState(getPersistedValue);
  useEffect(() => {
    localStorage.setItem('persist', JSON.stringify(persist));
  }, [persist]);
  const clearPersist = () => {
    localStorage.removeItem('persist');
  };
  return [persist, setPersist, clearPersist];
};

export default usePersist;
