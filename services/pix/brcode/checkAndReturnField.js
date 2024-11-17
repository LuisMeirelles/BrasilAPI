import BadRequestError from '@/errors/BadRequestError';

/**
 * @typedef {Object} Field
 *
 * @property {string} id The ID of the field.
 * @property {string} [description] The description of the field.
 * @property {boolean} [required=false] Whether the field is required.
 * @property {number} [length] The required length of the field value.
 * @property {number} [minLength] The minimum length of the field value.
 * @property {number} [maxLength] The maximum length of the field value.
 * @property {string} [value] The fixed value of the field. If provided, the field is not required and the value is used as is.
 * @property {(value: string) => boolean} [validate] The function to validate the field value.
 */

/**
 * If valid, returns the value of the field. Otherwise, throws an error.
 *
 * @param {Field} field
 *
 * @param {string} value
 * @returns {string}
 */
export const checkAndReturnField = (field, value) => {
  const error = new BadRequestError({
    message: `O campo '${field.description}' não é válido.`,
    errors: [],
  });

  if (field.value) {
    return field.value;
  }

  if (!value) {
    if (!field.required) {
      return '';
    }

    error.errors.push('É obrigatório.');
    throw error; // se é obrigatório e não foi informado não faz sentido continuar
  }

  if (field.length && value.length !== field.length) {
    error.errors.push(`Deve ter exatamente ${field.length} caracteres.`);
  }

  if (field.minLength && value.length < field.minLength) {
    error.errors.push(`Deve ter no mínimo ${field.minLength} caracteres.`);
  }

  if (field.maxLength && value.length > field.maxLength) {
    error.errors.push(`Deve ter no máximo ${field.maxLength} caracteres.`);
  }

  if (typeof field.validate === 'function') {
    const fieldValid = field.validate(value);

    if (!fieldValid) {
      error.errors.push(`Não passou na validação personalizada.`);
    }
  }

  if (error.errors.length > 0) {
    throw error;
  }

  return value;
};
