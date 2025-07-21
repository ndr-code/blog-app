import { useState } from 'react';

export const usePasswordVisibility = (initialState: boolean = false) => {
  const [showPassword, setShowPassword] = useState(initialState);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hidePassword = () => {
    setShowPassword(false);
  };

  const showPasswordText = () => {
    setShowPassword(true);
  };

  return {
    showPassword,
    togglePasswordVisibility,
    hidePassword,
    showPasswordText,
  };
};
