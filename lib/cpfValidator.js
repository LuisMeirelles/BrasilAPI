export const cpfIsValid = (cpf) => {
  let sum = 0;
  let remainder;

  if (/^(\d)\1*$/.test(cpf)) {
    return false;
  }

  for (let i = 1; i <= 9; i += 1) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) remainder = 0;

  if (remainder !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;

  for (let i = 1; i <= 10; i += 1) {
    sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;

  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  return remainder === parseInt(cpf.substring(10, 11), 10);
};
