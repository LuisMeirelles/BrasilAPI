/**
 * @typedef {Object} Field
 *
 * @property {string} id - The ID of the field
 * @property {string|Field[]|Field} [value] - The value of the field, can be a string, number, or an array of fields
 */

/**
 * Converts EMV fields into a string
 * @param {Field[]|Field} fields
 * @returns {string}
 */
export const convertEMVFieldsIntoString = (fields) => {
  if (Array.isArray(fields)) {
    return fields.map((field) => convertEMVFieldsIntoString(field)).join('');
  }

  const { id, value } = fields;

  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  }

  if (Array.isArray(value)) {
    const fieldValueString = value
      .map((field) => convertEMVFieldsIntoString(field))
      .join('');

    const length = fieldValueString.length.toString().padStart(2, '0');

    return `${id}${length}${fieldValueString}`;
  }

  if (value?.value) {
    const fieldValueString = convertEMVFieldsIntoString(value);

    const length = fieldValueString.length.toString().padStart(2, '0');

    return `${id}${length}${fieldValueString}`;
  }

  throw new Error('Invalid EMV field');
};
