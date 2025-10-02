import { toast, ToastOptions } from 'react-toastify';

// Enum for toast types
enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
}

// Function to display a toast notification
const showToast = (message: string, type: ToastType = ToastType.INFO): void => {
  const options: ToastOptions = {
    position: 'top-right',
    autoClose: 1000,
  };

  switch (type) {
    case ToastType.SUCCESS:
      toast.success(message, options);
      break;
    case ToastType.ERROR:
      toast.error(message, options);
      break;
    case ToastType.WARN:
      toast.warn(message, options);
      break;
    case ToastType.INFO:
    default:
      toast.info(message, options);
      break;
  }
};

export {ToastType, showToast}