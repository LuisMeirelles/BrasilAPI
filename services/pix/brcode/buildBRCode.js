import { calculateCrc } from './calculateCrc';
import emvSpecification from './emvSpecification';
import { checkAndReturnField } from './checkAndReturnField';
import { convertEMVFieldsIntoString } from './convertEMVFieldsIntoString';

/**
 * @typedef {Object} Data
 *
 * @property {string} pixKey
 * @property {string} additionalInfo
 * @property {string} merchantName
 * @property {string} merchantCity
 * @property {string} postalCode
 * @property {string} transactionId
 * @property {string} transactionAmount
 */

/**
 * Constrói o BRCode
 * @param {Data} data
 * @returns {string}
 */
export const buildBRCode = (data) => {
  const normalizedData = {};

  Object.keys(data).forEach((key) => {
    normalizedData[key] = String(data[key])
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  });

  const fields = [];

  fields.push(emvSpecification.payloadFormat);

  const merchantAccountInfoSpecification =
    emvSpecification.merchantAccountInformationPix.fields;

  const { gui } = merchantAccountInfoSpecification;

  const pixKey = {
    id: merchantAccountInfoSpecification.pixKey.id,
    value: checkAndReturnField(
      merchantAccountInfoSpecification.pixKey,
      normalizedData.pixKey
    ),
  };

  const additionalInfo = {
    id: merchantAccountInfoSpecification.additionalInfo.id,
    value: checkAndReturnField(
      merchantAccountInfoSpecification.additionalInfo,
      normalizedData.additionalInfo
    ),
  };

  fields.push({
    id: emvSpecification.merchantAccountInformationPix.id,
    value: [gui, pixKey, additionalInfo],
  });

  fields.push(emvSpecification.merchantCategoryCode);

  fields.push(emvSpecification.transactionCurrency);

  fields.push({
    id: emvSpecification.transactionAmount.id,
    value: checkAndReturnField(
      emvSpecification.transactionAmount,
      normalizedData.transactionAmount
    ),
  });

  fields.push(emvSpecification.countryCode);

  const { postalCode, merchantName, merchantCity } = emvSpecification;

  fields.push({
    id: merchantName.id,
    value: checkAndReturnField(merchantName, normalizedData.merchantName),
  });
  fields.push({
    id: merchantCity.id,
    value: checkAndReturnField(merchantCity, normalizedData.merchantCity),
  });

  fields.push({
    id: postalCode.id,
    value: checkAndReturnField(postalCode, normalizedData.postalCode),
  });

  fields.push({
    id: emvSpecification.additionalDataFieldTemplate.id,
    value: {
      id: emvSpecification.additionalDataFieldTemplate.fields.referenceLabel.id,
      value: checkAndReturnField(
        emvSpecification.additionalDataFieldTemplate.fields.referenceLabel,
        normalizedData.transactionId
      ),
    },
  });

  let fieldsString = convertEMVFieldsIntoString(fields);

  const crcLengthString = String(emvSpecification.crc.length).padStart(2, '0');

  fieldsString += emvSpecification.crc.id + crcLengthString;
  fieldsString += calculateCrc(fieldsString);

  return fieldsString;
};
