// utils/FormValidator.js
export const validateRegisterForm = (formData) => {
    const errors = {};
    if (!formData.mail_profile) errors.email = 'Email is required';
    if (formData.password_profile !== formData.confirm_password)
      errors.password = 'Passwords do not match';
    return errors;
  };
  