import { screen, waitFor } from '@testing-library/react';
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

  it('Testa se o nome do cliente e o logout', async () => {
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

    await waitFor(() => {
      const nome = screen.getByText(/Cliente Zé Birita/i);
      const pedidosButton = screen
        .getByTestId('customer_products__element-navbar-link-orders');
      const logOutButton = screen
        .getByTestId('customer_products__element-navbar-link-logout');

      expect(nome).toBeInTheDocument();
      expect(pedidosButton).toBeInTheDocument();
      expect(logOutButton).toBeInTheDocument();

      userEvent.click(logOutButton);
      expect(history.pathname).toBe('/');
    });
  });
  it('Testa se o redirecionamento para /orders/products', async () => {
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

    await waitFor(() => {
      const productsButton = screen
        .getByTestId('customer_products__element-navbar-link-products');

      expect(productsButton).toBeInTheDocument();

      jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: products });

      userEvent.click(productsButton);
      expect(history.pathname).toBe('/customer/products');
    });

    const logOutButton = screen
      .getByTestId('customer_products__element-navbar-link-logout');
    userEvent.click(logOutButton);
  });
});
