import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { wait } from '@testing-library/user-event/dist/utils';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';

describe('Testa a página de Login', () => {
  const emailZebirita = 'zebirita@email.com';
  const sellerEmail = 'fulana@deliveryapp.com';
  const adminEmail = 'adm@deliveryapp.com';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiQ2xpZW50ZSBaw6kgQmlyaXRhIiwiZW1haWwiOiJ6ZWJ'
  + 'pcml0YUBlbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZX'
  + 'IifSwiaWF0IjoxNjcwOTU2MDE4LCJleHAiOjE2Nzk1MDk2MTh9.'
  + 'qCdfvrHvSz8IP_nUAXDK0xsRlGFbIk_FvadFUDVYC1U';
  const loginButtonTestId = 'common_login__button-login';
  it('Testa os inputs como customer', async () => {
    const { history } = renderWithRouter(<App />);

    const expectedResponse = { data: {
      id: 3,
      name: 'Cliente Zé Birita',
      email: emailZebirita,
      role: 'customer',
      token,
    } };
    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    await waitFor(() => {
      expect(history.pathname).toBe('/login');
    });

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    expect(loginButton).toBeDisabled();

    userEvent.type(emailInput, emailZebirita);
    userEvent.type(passwordInput, '$#zebirita#$');

    expect(emailInput).toHaveValue(emailZebirita);
    expect(passwordInput).toHaveValue('$#zebirita#$');
    expect(loginButton).not.toBeDisabled();

    userEvent.click(loginButton);

    await waitFor(() => {
      expect(history.pathname).toBe('/customer/products');
    });
  });
  it('Testa os inputs como seller', async () => {
    const { history } = renderWithRouter(<App />);

    const expectedResponse = { data: {
      id: 2,
      name: 'Fulana Pereira',
      email: sellerEmail,
      role: 'seller',
      token,
    } };
    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    await waitFor(() => {
      expect(history.pathname).toBe('/login');
    });

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    expect(loginButton).toBeDisabled();

    userEvent.type(emailInput, sellerEmail);
    userEvent.type(passwordInput, 'fulana@123');

    expect(emailInput).toHaveValue(sellerEmail);
    expect(passwordInput).toHaveValue('fulana@123');
    expect(loginButton).not.toBeDisabled();

    userEvent.click(loginButton);

    await waitFor(() => {
      expect(history.pathname).toBe('/seller/orders');
    });
  });
  it('Testa os inputs como admin', async () => {
    const { history } = renderWithRouter(<App />);

    const expectedResponse = { data: {
      id: 1,
      name: 'Delivery App Admin',
      email: adminEmail,
      role: 'administrator',
      token,
    } };
    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    await waitFor(() => {
      expect(history.pathname).toBe('/login');
    });

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    expect(loginButton).toBeDisabled();

    userEvent.type(emailInput, adminEmail);
    userEvent.type(passwordInput, '--adm2@21!!--');

    expect(emailInput).toHaveValue(adminEmail);
    expect(passwordInput).toHaveValue('--adm2@21!!--');
    expect(loginButton).not.toBeDisabled();

    userEvent.click(loginButton);

    await waitFor(() => {
      expect(history.pathname).toBe('/admin/manage');
    });
  });
  it('Testa o redirecionamento para a página de cadastro', async () => {
    const { history } = renderWithRouter(<App />);

    const registerButton = screen.getByTestId('common_login__button-register');
    userEvent.click(registerButton);

    await wait(() => {
      expect(history.pathname).toBeInTheDocument('/register');
    });
  });
  it('Testa erros', async () => {
    const { debug } = renderWithRouter(<App />);

    jest.spyOn(httpRequest, 'post')
      .mockRejectedValueOnce(new Error());

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    expect(loginButton).toBeDisabled();

    userEvent.type(emailInput, 'email@teste.com');
    userEvent.type(passwordInput, 'senha_aleatoria');

    expect(emailInput).toHaveValue('email@teste.com');
    expect(passwordInput).toHaveValue('senha_aleatoria');
    expect(loginButton).not.toBeDisabled();

    userEvent.click(loginButton);

    // expect(errorMock).toHaveBeenCalled();

    await wait(() => {
      const errorMsg = screen.getByText(/dados inválidos/i);
      expect(errorMsg).toBeInTheDocument();
    });
    debug();
  });
});
