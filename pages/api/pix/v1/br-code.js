import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import { buildBRCode } from '@/services/pix/brcode/buildBRCode';

const action = async (request, response) => {
  const {
    pixKey,
    additionalInfo,
    merchantCity,
    merchantName,
    transactionId,
    postalCode,
    transactionAmount,
  } = request.body;

  try {
    const brCode = buildBRCode({
      pixKey,
      additionalInfo,
      merchantCity,
      merchantName,
      transactionId,
      postalCode,
      transactionAmount,
    });

    response.status(200);
    response.json({ pixCopiaCola: brCode });
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: `Erro ao gerar o BR Code`,
      name: 'BR_CODE_PIX_GENERATION_ERROR',
    });
  }
};

export default app().post(action);
