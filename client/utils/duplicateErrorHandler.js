export const errorDulicateHandler = (message) => {
  const error = new Error();
  const errorToLowerCase = message.toLowerCase();
  error.message = "Email already exists.";
  return error;
};
