// Utility functions for profile completion checks
export const isProfileComplete = (user) => {
  if (!user) return false;
  
  // Check if profile is explicitly marked as completed
  if (user.profile_completed === true) return true;
  
  const requiredFields = ['nama_lengkap', 'no_handphone', 'alamat', 'pendidikan_terakhir'];
  
  // List of temporary/placeholder values that should be treated as empty
  const temporaryValues = [
    'temporary name',
    'temporary address', 
    'temporary education',
    '0000000000',
    'temp',
    'placeholder',
    'default'
  ];
  
  const isComplete = requiredFields.every(field => {
    const value = user[field];
    if (!value || value.toString().trim() === '') return false;
    
    // Check if value is a temporary/placeholder value
    const lowerValue = value.toString().toLowerCase().trim();
    const isTemporary = temporaryValues.some(temp => 
      lowerValue.includes(temp.toLowerCase())
    );
    
    return !isTemporary;
  });
  
  return isComplete;
};

export const getIncompleteFields = (user) => {
  if (!user) return ['nama_lengkap', 'no_handphone', 'alamat', 'pendidikan_terakhir'];
  
  const requiredFields = ['nama_lengkap', 'no_handphone', 'alamat', 'pendidikan_terakhir'];
  
  // List of temporary/placeholder values that should be treated as empty
  const temporaryValues = [
    'temporary name',
    'temporary address', 
    'temporary education',
    '0000000000',
    'temp',
    'placeholder',
    'default'
  ];
  
  return requiredFields.filter(field => {
    const value = user[field];
    if (!value || value.toString().trim() === '') return true;
    
    // Check if value is a temporary/placeholder value
    const lowerValue = value.toString().toLowerCase().trim();
    const isTemporary = temporaryValues.some(temp => 
      lowerValue.includes(temp.toLowerCase())
    );
    
    return isTemporary;
  });
};

export const getProfileCompletionPercentage = (user) => {
  if (!user) return 0;
  
  const requiredFields = ['nama_lengkap', 'no_handphone', 'alamat', 'pendidikan_terakhir'];
  
  // List of temporary/placeholder values that should be treated as empty
  const temporaryValues = [
    'temporary name',
    'temporary address', 
    'temporary education',
    '0000000000',
    'temp',
    'placeholder',
    'default'
  ];
  
  const completedFields = requiredFields.filter(field => {
    const value = user[field];
    if (!value || value.toString().trim() === '') return false;
    
    // Check if value is a temporary/placeholder value
    const lowerValue = value.toString().toLowerCase().trim();
    const isTemporary = temporaryValues.some(temp => 
      lowerValue.includes(temp.toLowerCase())
    );
    
    return !isTemporary;
  });
  
  return Math.round((completedFields.length / requiredFields.length) * 100);
};
