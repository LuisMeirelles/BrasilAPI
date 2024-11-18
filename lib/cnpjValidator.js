const calculateDigit = (baseCNPJ, weights) => {
  const sum = baseCNPJ
    .map((num, index) => num * weights[index])
    .reduce((acc, curr) => acc + curr, 0);

  const remainder = sum % 11;

  return remainder < 2 ? 0 : 11 - remainder;
};

export const cnpjIsValid = (cnpj) => {
  const cnpjNumberOnly = cnpj.replace(/\D+/g, '');

  if (/^(\d)\1*$/.test(cnpjNumberOnly)) {
    return false;
  }

  const cnpjArray = cnpjNumberOnly.split('').map(Number);

  const weightsFirstDigit = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weightsSecondDigit = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const firstDigit = calculateDigit(cnpjArray.slice(0, 12), weightsFirstDigit);
  const secondDigit = calculateDigit(
    cnpjArray.slice(0, 13),
    weightsSecondDigit
  );

  return firstDigit === cnpjArray[12] && secondDigit === cnpjArray[13];
};
