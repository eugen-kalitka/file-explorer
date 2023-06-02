import { toast } from "react-toastify";

const errorHandler = (message) => {
  console.log('WS package error', message);
  toast.error(message);
}

export default errorHandler;
