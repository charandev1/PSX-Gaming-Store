import { isAxiosError } from 'axios';
import { showToastErrorMessage } from './toastMessage';

export const handleError = (error: unknown) => {
  if (isAxiosError(error) && error.response) {
    console.error(error.response.data.message);
  } else {
    console.error(error);
  }
  showToastErrorMessage(`uh oh! something went wrong`);
};
