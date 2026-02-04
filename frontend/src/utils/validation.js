export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s\-()]+$/;
  return re.test(phone);
};

export const validateCGPA = (cgpa, scale) => {
  const cgpaNum = parseFloat(cgpa);
  return cgpaNum >= 0 && cgpaNum <= scale;
};
