// Password validation utility functions
export const validatePassword = (password) => {
  const errors = [];
  
  // Check minimum length
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf besar');
  }
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 huruf kecil');
  }
  
  // Check for number
  if (!/\d/.test(password)) {
    errors.push('Password harus mengandung minimal 1 angka');
  }
  
  // Check for special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password harus mengandung minimal 1 karakter khusus (!@#$%^&* dll)');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

export const getPasswordStrength = (password) => {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
  
  // Count passed checks
  Object.values(checks).forEach(check => {
    if (check) score++;
  });
  
  // Additional points for longer passwords
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;
  
  let strength = 'Sangat Lemah';
  let color = 'red';
  
  if (score >= 5) {
    strength = 'Sangat Kuat';
    color = 'green';
  } else if (score >= 4) {
    strength = 'Kuat';
    color = 'blue';
  } else if (score >= 3) {
    strength = 'Sedang';
    color = 'yellow';
  } else if (score >= 2) {
    strength = 'Lemah';
    color = 'orange';
  }
  
  return {
    score: Math.min(score, 5),
    strength: strength,
    color: color,
    checks: checks
  };
};

export const generatePasswordSuggestion = () => {
  const suggestions = [
    'Password123!',
    'MySecure2024#',
    'StrongPass456$',
    'SecureKey789@',
    'SafeLogin2024!',
    'MyPassword123#'
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
};
