import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';
import products from './mocks/products';

const loginButtonTestId = 'common_login__button-login';

describe('Testa o HeaderSeller', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJkYXRhIjp7ImlkIjoyLCJuYW1lIjoiRnVsYW5hIFBlcmVpcm'
  + 'EiLCJlbWFpbCI6ImZ1bGFuYUBkZWxpdmVyeWFwcC5jb20iLCJyb'
  + '2xlIjoic2VsbGVyIn0sImlhdCI6MTY3Mzg5MDk0NCwiZXhwIjoxN'
  + 'jgyNDQ0NTQ0fQ.kuQ_XlXFcZERIoZDQym1gc50D6QD6q4KnH6QCC4sMbU';

  const expectedResponse = { data: {
    id: 2,
    name: 'Fulana Pereira',
    email: 'fulana@deliveryapp.com',
    role: 'seller',
    token,
  } };
  it('Testa o redirecionamento para a página de pedidos', async () => {
    const { history } = renderWithRouter(<App />);

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, expectedResponse.data.email);
    userEvent.type(passwordInput, 'fulana@123');

    userEvent.click(loginButton);

    const ordersButton = await screen.findByRole('button', { name: /pedidos/i });
    userEvent.click(ordersButton);

    await waitFor(() => {
      console.log(history.pathname);
      expect(history.pathname).toBe('/seller/orders');
    });

    const leaveButton = await screen.findByRole('button', { name: /sair/i });
    userEvent.click(leaveButton);
  });
  it.skip('Testa o redirecionamento para a página de produtos', async () => {
    const { history } = renderWithRouter(<App />);

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, expectedResponse.data.email);
    userEvent.type(passwordInput, 'fulana@123');

    userEvent.click(loginButton);

    const ordersButton = await screen.findByRole('button', { name: /produtos/i });
    userEvent.click(ordersButton);

    // await waitFor(() => {
    //   console.log(history.pathname);
    //   expect(history.pathname).toBe('/seller/products');
    // });

    // const leaveButton = await screen.findByRole('button', { name: /sair/i });
    // userEvent.click(leaveButton);
  });
});
