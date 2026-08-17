
export interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSpecialChars?: boolean;
}

export const generateSecurePassword = (
  options: PasswordOptions = {}
): string => {
  const {
    length = 12,
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecialChars = true,
  } = options;

  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  let charPool = "";
  if (includeUppercase) charPool += uppercase;
  if (includeLowercase) charPool += lowercase;
  if (includeNumbers) charPool += numbers;
  if (includeSpecialChars) charPool += specialChars;

  if (charPool.length === 0) {
    charPool = uppercase + lowercase + numbers + specialChars;
  }

  let password = "";
  if (includeUppercase) {
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
  }
  if (includeLowercase) {
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
  }
  if (includeNumbers) {
    password += numbers[Math.floor(Math.random() * numbers.length)];
  }
  if (includeSpecialChars) {
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
  }

  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charPool[Math.floor(Math.random() * charPool.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

export const validatePasswordStrength = (password: string) => {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password);
  const hasMinLength = password.length >= 8;

  const strength = [
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
  ].filter(Boolean).length;

  return {
    isValid: strength >= 4,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    hasMinLength,
    strength: strength >= 5 ? "strong" : strength >= 3 ? "medium" : "weak",
  };
};
