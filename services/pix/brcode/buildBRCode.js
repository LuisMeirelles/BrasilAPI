import { calculateCrc } from '@/services/pix/brcode/calculateCrc';
import emvSpecification from './emvSpecification';
import { checkAndReturnField } from './checkAndReturnField';
import { buildEMVField } from './buildEMVField';

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
  const fields = [];

  fields.push(buildEMVField(emvSpecification.payloadFormat));

  const merchantAccountInfoSpecification =
    emvSpecification.merchantAccountInformationPix.fields;

  const gui = buildEMVField(merchantAccountInfoSpecification.gui);

  const pixKey = buildEMVField({
    id: merchantAccountInfoSpecification.pixKey.id,
    value: checkAndReturnField(
      merchantAccountInfoSpecification.pixKey,
      data.pixKey
    ),
  });

  const additionalInfo = buildEMVField({
    id: merchantAccountInfoSpecification.additionalInfo.id,
    value: checkAndReturnField(
      merchantAccountInfoSpecification.additionalInfo,
      data.additionalInfo
    ),
  });

  fields.push(
    buildEMVField({
      id: emvSpecification.merchantAccountInformationPix.id,
      value: gui + pixKey + additionalInfo,
    })
  );

  fields.push(buildEMVField(emvSpecification.merchantCategoryCode));

  fields.push(buildEMVField(emvSpecification.transactionCurrency));

  fields.push(
    buildEMVField({
      id: emvSpecification.transactionAmount.id,
      value: checkAndReturnField(
        emvSpecification.transactionAmount,
        data.transactionAmount
      ),
    })
  );

  fields.push(buildEMVField(emvSpecification.countryCode));

  const { postalCode, merchantName, merchantCity } = emvSpecification;

  fields.push(
    buildEMVField({
      id: merchantName.id,
      value: checkAndReturnField(merchantName, data.merchantName),
    })
  );
  fields.push(
    buildEMVField({
      id: merchantCity.id,
      value: checkAndReturnField(merchantCity, data.merchantCity),
    })
  );

  fields.push(
    buildEMVField({
      id: postalCode.id,
      value: checkAndReturnField(postalCode, data.postalCode),
    })
  );

  fields.push(
    buildEMVField({
      id: emvSpecification.additionalDataFieldTemplate.id,
      value: buildEMVField({
        id: emvSpecification.additionalDataFieldTemplate.fields.referenceLabel
          .id,
        value: checkAndReturnField(
          emvSpecification.additionalDataFieldTemplate.fields.referenceLabel,
          data.transactionId
        ),
      }),
    })
  );

  const crcLengthString = String(emvSpecification.crc.length).padStart(2, '0');

  const crcPayload =
    fields.join('') + emvSpecification.crc.id + crcLengthString;

  fields.push(
    buildEMVField({
      id: emvSpecification.crc.id,
      value: calculateCrc(crcPayload),
    })
  );

  return fields.join('');
};
