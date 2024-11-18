const axios = require('axios');
const { testBadRequest } = require('./helpers/testBadRequest');
const { testCorsForRoute } = require('./helpers/cors');

describe('POST api/pix/v1/br-code', () => {
  const requestUrl = `${global.SERVER_URL}/api/pix/v1/br-code`;

  const basicPayload = {
    pixKey: 'test@example.com',
    additionalInfo: 'Infos Adicionais',
    merchantCity: 'Curitiba',
    merchantName: 'Jane Doe',
    transactionId: '123456789',
    postalCode: '12345678',
    transactionAmount: 123.45,
  };

  const PIX_KEY_FIELD_ID = '01';
  const MERCHANT_NAME_FIELD_ID = '59';
  const MERCHANT_CITY_FIELD_ID = '60';
  const TRANSACTION_ID_FIELD_ID = '05';
  const ADDITIONAL_DATA_FIELD_TEMPLATE_ID = '62';

  test('Utilizando um payload válido, deve retornar um BR Code válido', async () => {
    const expectedBRCode =
      '00020126580014BR.GOV.BCB.PIX0116test@example.com0216Infos Adicionais5204000053039865406123.455802BR5908Jane Doe6008Curitiba610812345678621305091234567896304EBA6';

    const { status, data } = await axios.post(requestUrl, basicPayload);

    expect(status).toBe(200);
    expect(data).toHaveProperty('pixCopiaCola', expectedBRCode);
  });

  test('Utilizando um payload com chave pix válida do tipo email, deve retornar a mesma no pix copia e cola', async () => {
    const PIX_KEY_LENGTH = '16';
    const PIX_KEY = 'test@example.com';

    const payload = {
      ...basicPayload,
      pixKey: PIX_KEY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(PIX_KEY_FIELD_ID + PIX_KEY_LENGTH + PIX_KEY)
    );
  });

  test('Utilizando um payload com chave pix inválida do tipo email, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: 'testexample.com',
    });
  });

  test('Utilizando um payload com chave pix válida do tipo CPF, deve retornar a mesma no pix copia e cola', async () => {
    const PIX_KEY_LENGTH = '11';
    const PIX_KEY = '53406154050';

    const payload = {
      ...basicPayload,
      pixKey: PIX_KEY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(PIX_KEY_FIELD_ID + PIX_KEY_LENGTH + PIX_KEY)
    );
  });

  test('Utilizando um payload com chave pix inválida do tipo CPF, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: '12345678901',
    });
  });

  test('Utilizando um payload com chave pix válida do tipo CNPJ, deve retornar a mesma no pix copia e cola', async () => {
    const PIX_KEY_LENGTH = '14';
    const PIX_KEY = '62910934000118';

    const payload = {
      ...basicPayload,
      pixKey: PIX_KEY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(PIX_KEY_FIELD_ID + PIX_KEY_LENGTH + PIX_KEY)
    );
  });

  test('Utilizando um payload com chave pix inválida do tipo CNPJ, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: '12345678901234',
    });
  });

  test('Utilizando um payload com chave pix válida do tipo celular, deve retornar a mesma no pix copia e cola', async () => {
    const PIX_KEY_LENGTH = '13';
    const PIX_KEY = '5511912345678';

    const payload = {
      ...basicPayload,
      pixKey: PIX_KEY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(PIX_KEY_FIELD_ID + PIX_KEY_LENGTH + PIX_KEY)
    );
  });

  test('Utilizando um payload com chave pix inválida do tipo celular, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: '551191234567',
    });
  });

  test('Utilizando um payload com chave pix válida do tipo chave aleatória, deve retornar a mesma no pix copia e cola', async () => {
    const PIX_KEY_LENGTH = '36';
    const PIX_KEY = '123e4567-e89b-12d3-a456-426614174000';

    const payload = {
      ...basicPayload,
      pixKey: PIX_KEY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(PIX_KEY_FIELD_ID + PIX_KEY_LENGTH + PIX_KEY)
    );
  });

  test('Utilizando um payload com chave pix inválida do tipo chave aleatória, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: '123e4567-e89b-12d3-a456-42661417400',
    });
  });

  test('Utilizando um payload sem a chave pix, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: undefined,
    });
  });

  test('Utilizando um payload com a chave pix inválida, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      pixKey: 'invalid-pix-key',
    });
  });

  test('Utilizando um payload com nome do destinatário válido, deve retornar o mesmo no pix copia e cola', async () => {
    const MERCHANT_NAME_LENGTH = '08';
    const MERCHANT_NAME = 'Jane Doe';

    const payload = {
      ...basicPayload,
      merchantName: MERCHANT_NAME,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(
        MERCHANT_NAME_FIELD_ID + MERCHANT_NAME_LENGTH + MERCHANT_NAME
      )
    );
  });

  test('Utilizando um payload sem o nome do destinatário, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      merchantName: undefined,
    });
  });

  test('Utilizando um payload com o nome do destinatário maior que 25 caracteres, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      merchantName: 'abcdefghijklmnopqrstuvwxyz',
    });
  });

  test('Utilizando um payload com o nome da cidade válido, deve retornar o mesmo no pix copia e cola', async () => {
    const MERCHANT_CITY_LENGTH = '08';
    const MERCHANT_CITY = 'Curitiba';

    const payload = {
      ...basicPayload,
      merchantCity: MERCHANT_CITY,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(
        MERCHANT_CITY_FIELD_ID + MERCHANT_CITY_LENGTH + MERCHANT_CITY
      )
    );
  });

  test('Utilizando um payload sem o nome da cidade, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      merchantCity: undefined,
    });
  });

  test('Utilizando um payload com o nome da cidade maior que 15 caracteres, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      merchantCity: 'abcdefghijklmnop',
    });
  });

  test('Utilizando um payload com o ID da transação válido, deve retornar o mesmo no pix copia e cola', async () => {
    const TRANSACTION_ID_LENGTH = '09';
    const TRANSACTION_ID = 'XXXXXXXXX';

    const ADDITIONAL_DATA_FIELD_LENGTH = (
      TRANSACTION_ID_FIELD_ID +
      TRANSACTION_ID_LENGTH +
      TRANSACTION_ID
    ).length;

    const ADDITIONAL_DATA_FIELD =
      ADDITIONAL_DATA_FIELD_TEMPLATE_ID +
      ADDITIONAL_DATA_FIELD_LENGTH.toString().padStart(2, '0') +
      TRANSACTION_ID_FIELD_ID +
      TRANSACTION_ID_LENGTH +
      TRANSACTION_ID;

    const payload = {
      ...basicPayload,
      transactionId: TRANSACTION_ID,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'pixCopiaCola',
      expect.stringContaining(ADDITIONAL_DATA_FIELD)
    );
  });

  test('Utilizando um payload sem o ID da transação, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      transactionId: undefined,
    });
  });

  test('Utilizando um payload com o ID da transação maior que 25 caracteres, deve retornar um erro', async () => {
    await testBadRequest(requestUrl, 'POST', {
      ...basicPayload,
      transactionId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    });
  });

  test('Utilizando um payload com caracteres acentuados, deve transformá-los em caracteres não acentuados', async () => {
    const expectedMerchantCity = 'Sao Jose';
    const expectedMerchantName = 'Cafe do Joao';
    const expectedAdditionalInfo = 'Informacao sobre acai';

    const accentedPayload = {
      ...basicPayload,
      merchantCity: 'São José',
      merchantName: 'Café do João',
      additionalInfo: 'Informação sobre açaí',
    };

    const { status, data } = await axios.post(requestUrl, accentedPayload);

    expect(status).toBe(200);
    expect(data).toHaveProperty('data.merchantCity', expectedMerchantCity);
    expect(data).toHaveProperty('data.merchantName', expectedMerchantName);
    expect(data).toHaveProperty('data.additionalInfo', expectedAdditionalInfo);
  });

  test('Utilizando um payload com valor de transação com apenas uma casa decimal, deve retornar o valor com duas casas decimais, em formato de string', async () => {
    const expectedTransactionAmount = '432.10';

    const payload = {
      ...basicPayload,
      transactionAmount: 432.1,
    };

    const { status, data } = await axios.post(requestUrl, payload);

    expect(status).toBe(200);
    expect(data).toHaveProperty(
      'data.transactionAmount',
      expectedTransactionAmount
    );
  });

  testCorsForRoute('/api/pix/v1/br-code', 'POST', basicPayload);
});
