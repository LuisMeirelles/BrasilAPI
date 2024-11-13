export const buildEMVField = ({ id, value }) => {
  if (!value) {
    return '';
  }

  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
};
