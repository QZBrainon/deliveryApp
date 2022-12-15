import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';

describe('Testa o Register', () => {
  const eduardo = 'Eduardo Prado';
  const emailTeste = 'meuemail@teste.com';
  const customerRole = 'customer';
  it('Testa o cadastro', async () => {
    const { history } = renderWithRouter(<App />);

    const registerButton = screen.getByRole('button', { name: /ainda não tenho conta/i });
    userEvent.click(registerButton);

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce({ name: eduardo,
      email: emailTeste,
      role: customerRole });

    const nameInputRegister = screen.getByTestId('common_register__input-name');
    const emailInputRegister = screen.getByTestId('common_register__input-email');
    const passwordInputRegister = screen.getByTestId('common_register__input-password');
    const registerButtonSubmit = screen.getByRole('button', { name: /cadastrar/i });

    expect(registerButtonSubmit).toBeDisabled();

    userEvent.type(nameInputRegister, eduardo);
    userEvent.type(emailInputRegister, emailTeste);
    userEvent.type(passwordInputRegister, 'senha123');

    expect(nameInputRegister).toHaveValue(eduardo);
    expect(emailInputRegister).toHaveValue('meuemail@teste.com');
    expect(passwordInputRegister).toHaveValue('senha123');
    expect(registerButtonSubmit).not.toBeDisabled();

    userEvent.click(registerButtonSubmit);

    await waitFor(() => {
      console.log(history);
      expect(history.pathname).toBe('/customer/products');
    });
  });
  it('Testa o register com erro', async () => {
    renderWithRouter(<App />, '/register');

    // const registerButton = screen.getByRole('button', { name: /ainda não tenho conta/i });
    // userEvent.click(registerButton);

    const nameInputRegister = screen.getByTestId('common_register__input-name');
    const emailInputRegister = screen.getByTestId('common_register__input-email');
    const passwordInputRegister = screen.getByTestId('common_register__input-password');
    const registerButtonSubmit = screen.getByRole('button', { name: /cadastrar/i });

    jest.spyOn(httpRequest, 'post').mockRejectedValueOnce(new Error());

    userEvent.type(nameInputRegister, eduardo);
    userEvent.type(emailInputRegister, 'zebirita@email.com');
    userEvent.type(passwordInputRegister, 'senha123');
    userEvent.click(registerButtonSubmit);

    const errorMsg = await screen
      .findByTestId('common_register__element-invalid_register');
    expect(errorMsg).toBeInTheDocument();
  });
});
