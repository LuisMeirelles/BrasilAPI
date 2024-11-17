import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { buildBRCode } from '@/services/pix/brcode/buildBRCode';

const normalizeAccentedString = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const action = async (request, response) => {
  const {
    additionalInfo: additionalInfoRaw,
    merchantCity: merchantCityRaw,
    merchantName: merchantNameRaw,
    transactionAmount: transactionAmountRaw,
    pixKey,
    transactionId,
    postalCode,
  } = request.body;

  const additionalInfo = normalizeAccentedString(additionalInfoRaw);
  const merchantCity = normalizeAccentedString(merchantCityRaw);
  const merchantName = normalizeAccentedString(merchantNameRaw);
  const transactionAmount = parseFloat(transactionAmountRaw).toFixed(2);

  try {
    const data = {
      additionalInfo,
      merchantCity,
      merchantName,
      transactionAmount,
      pixKey,
      transactionId,
      postalCode,
    };

    const brCode = buildBRCode(data);

    response.status(200);
    response.json({ pixCopiaCola: brCode, data });
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: `Erro ao gerar o BR Code`,
      name: 'BR_CODE_PIX_GENERATION_ERROR',
      errors: [error],
    });
  }
};

export default app().post(action);
