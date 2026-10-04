import { useState, useEffect, createContext } from 'react';

type TimerContextType = {
  timer: string;
};

type TimerProviderPropsType = {
  children: React.ReactNode;
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider = ({ children }: TimerProviderPropsType) => {
  const [time, setTime] = useState(5 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTime(time - 1000);
    }, 1000);

    // break condition
    if (time! <= 0) {
      clearTimeout(timerId);
    }

    // cleanup
    return () => {
      clearTimeout(timerId);
    };
  }, [time]);

  const getFormattedTime = (time: number) => {
    const days = Math.floor(time / DAY);
    const hours = Math.floor((time % DAY) / HOUR);
    const minutes = Math.floor((time % HOUR) / MINUTE);
    const seconds = Math.floor((time % MINUTE) / SECOND);

    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  };

  const value = { timer: getFormattedTime(time) };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
