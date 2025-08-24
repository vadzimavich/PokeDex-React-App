export const checkPasswordStrength = (password: string): number => {
  let score = 0;
  if (!password) return 0;

  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  if (hasNumber) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasSpecialChar) score++;

  return score;
};

export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
