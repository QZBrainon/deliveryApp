import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';
import products from './mocks/products';

describe('Testa o Header', () => {
  const emailZebirita = 'zebirita@email.com';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiQ2xpZW50ZSBaw6kgQmlyaXRhIiwiZW1haWwiOiJ6ZWJ'
  + 'pcml0YUBlbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZX'
  + 'IifSwiaWF0IjoxNjcwOTU2MDE4LCJleHAiOjE2Nzk1MDk2MTh9.'
  + 'qCdfvrHvSz8IP_nUAXDK0xsRlGFbIk_FvadFUDVYC1U';
  const loginButtonTestId = 'common_login__button-login';
  const zeBirita = 'Cliente Zé Birita';
  const zeBiritaPassword = '$#zebirita#$';

  it('Testa se o redirecionamento para /customer/orders', async () => {
    const { history } = renderWithRouter(<App />);

    const expectedResponse = { data: {
      id: 3,
      name: zeBirita,
      email: emailZebirita,
      role: 'customer',
      token,
    } };
    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, emailZebirita);
    userEvent.type(passwordInput, zeBiritaPassword);

    userEvent.click(loginButton);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: products });

    const ordersButton = await screen.findByRole('button', { name: /meus pedidos/i });

    expect(ordersButton).toBeInTheDocument();

    userEvent.click(ordersButton);

    expect(history.pathname).toBe('/customer/orders');
  });
});
