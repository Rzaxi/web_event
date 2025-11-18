// Utility functions for displaying profile data
export const displayProfileValue = (value, fallback = '...') => {
  if (!value || value.toString().trim() === '') {
    return fallback;
  }
  
  // Check if value is a temporary/placeholder value
  const lowerValue = value.toString().toLowerCase().trim();
  const temporaryValues = [
    'temporary name',
    'temporary address', 
    'temporary education',
    '0000000000',
    'temp',
    'placeholder',
    'default'
  ];
  
  const isTemporary = temporaryValues.some(temp => 
    lowerValue.includes(temp.toLowerCase())
  );
  
  return isTemporary ? fallback : value;
};

export const displayName = (user) => {
  if (!user) return '...';
  return displayProfileValue(user.nama_lengkap, '...');
};

export const displayPhone = (user) => {
  if (!user) return '...';
  return displayProfileValue(user.no_handphone, '...');
};

export const displayAddress = (user) => {
  if (!user) return '...';
  return displayProfileValue(user.alamat, '...');
};

export const displayEducation = (user) => {
  if (!user) return '...';
  return displayProfileValue(user.pendidikan_terakhir, '...');
};
