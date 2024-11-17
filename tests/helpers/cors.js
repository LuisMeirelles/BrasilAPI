const axios = require('axios');

const testCorsForRoute = (route, method = 'GET', payload = undefined) => {
  describe(`CORS Middleware for ${route}`, () => {
    const url = `${global.SERVER_URL}${route}`;

    it(`deve permitir solicitações da origem permitida usando ${method}`, async () => {
      const response = await axios({
        url,
        method,
        data: payload,
        headers: { Origin: 'http://exemplo.com' },
      });

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.status).toBe(method === 'OPTIONS' ? 204 : 200);
    });

    it('deve lidar corretamente com pre-flight CORS request', async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Method': method,
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toContain(
        'GET,HEAD,PUT,PATCH,POST,DELETE'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Authorization'
      );
      expect(response.status).toBe(204);
    });

    it(`deve permitir o método ${method} no pre-flight`, async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Method': method,
        },
      });

      expect(response.headers['access-control-allow-methods']).toContain(
        method
      );
    });

    it(`deve permitir cabeçalhos específicos para ${method}`, async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Headers': 'Content-Type',
        },
      });

      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
    });
  });
};

module.exports = { testCorsForRoute };
