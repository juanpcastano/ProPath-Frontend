import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Api } from '../api/Api';

const mock = new MockAdapter(axios);

test('debería obtener datos correctamente', async () => {
  mock.onGet('/endpoint').reply(200, { data: 'result' });
  const resultado = await Api();
  expect(resultado.data).toBe('result');
});
