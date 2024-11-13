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
  const errors = [];

  if (field.value) {
    return field.value;
  }

  if (!value) {
    if (!field.required) {
      return '';
    }

    throw new BadRequestError({
      message: `O campo '${field.description}' é obrigatório.`,
    });
  }

  if (field.length && value.length !== field.length) {
    errors.push(
      `O campo '${field.description}' deve ter exatamente ${field.length} caracteres.`
    );
  }

  if (field.minLength && value.length < field.minLength) {
    errors.push(
      `O campo '${field.description}' deve ter no mínimo ${field.minLength} caracteres.`
    );
  }

  if (field.maxLength && value.length > field.maxLength) {
    errors.push(
      `O campo '${field.description}' deve ter no máximo ${field.maxLength} caracteres.`
    );
  }

  if (typeof field.validate === 'function') {
    const fieldValid = field.validate(value);

    if (!fieldValid) {
      errors.push(
        `O campo '${field.description}' é inválido (validação personalizada).`
      );
    }
  }

  if (errors.length === 1) {
    throw new BadRequestError({ message: errors[0] });
  }

  if (errors.length > 1) {
    throw new BadRequestError({
      message: `O campo '${field.description}' não é válido.`,
      errors,
    });
  }

  return value;
};
