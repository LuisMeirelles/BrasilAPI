const axios = require('axios');

const testBadRequest = async (
  requestUrl,
  method = 'GET',
  payload = undefined,
  expectedError = { type: 'bad_request', name: 'BadRequestError' }
) => {
  const { status, data } = await axios({
    method,
    url: requestUrl,
    data: payload,
    validateStatus: () => true,
  }).catch((e) => e.response);

  expect(status).toBe(400);
  expect(data).toHaveProperty('type', expectedError.type);
  expect(data).toHaveProperty('name', expectedError.name);
};

module.exports = { testBadRequest };
