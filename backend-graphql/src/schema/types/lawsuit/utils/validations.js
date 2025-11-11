export const normalizeCNJ = (cnjNumber) => {
  if (!cnjNumber) return '';
  return cnjNumber.replace(/[^0-9]/g, '');
};

export const isValidCNJ = (cnjNumber) => {
  if (!cnjNumber) return false;
  
  if (/[a-zA-Z]/.test(cnjNumber)) {
    return false;
  }
  
  const normalized = normalizeCNJ(cnjNumber);
  return /^\d{20}$/.test(normalized);
};

