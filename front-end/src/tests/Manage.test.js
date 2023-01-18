import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';
import users from './mocks/userList';

const loginButtonTestId = 'common_login__button-login';
const randomName = 'Algum nome qualquer';
const randomEmail = 'algumemail@email.com';
const randomPassword = 'senha123*!';

describe('Testa a page Manage', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXR'
  + 'hIjp7ImlkIjoxLCJuYW1lIjoiRGVsaXZlcnkgQXBwIEFkbWluIiwiZW1h'
  + 'aWwiOiJhZG1AZGVsaXZlcnlhcHAuY29tIiwicm9sZSI6ImFkbWluaXN0cm'
  + 'F0b3IifSwiaWF0IjoxNjczOTc4MjY4LCJleHAiOjE2ODI1MzE4Njh9.vCZ3'
  + '-yXsGfyY9vwdmJCs-9N_740ePM2GSEE4HaPPRD8';

  const expectedResponse = { data: {
    id: 1,
    name: 'Delivery App Admin',
    email: 'adm@deliveryapp.com',
    role: 'administrator',
    token,
  } };
  it('Testa o remoção e adição de usuários', async () => {
    const { history } = renderWithRouter(<App />);

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, expectedResponse.data.email);
    userEvent.type(passwordInput, '--adm2@21!!--');

    userEvent.click(loginButton);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: users });

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/admin/manage');
    });

    const deleteUserButtons = await screen.findAllByRole('button');

    jest.spyOn(httpRequest, 'delete').mockResolvedValueOnce();

    userEvent.click(deleteUserButtons[2]);

    const nameInputForm = screen.getByPlaceholderText(/seu nome/i);
    const emailInputForm = screen
      .getByPlaceholderText(/seu-email@site.com.br/i);
    const passwordInputForm = screen
      .getByPlaceholderText('**********');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    const roleOptions = screen.getAllByRole('option');

    expect(submitButton).toBeDisabled();

    userEvent.type(nameInputForm, randomName);
    userEvent.type(emailInputForm, randomEmail);
    userEvent.type(passwordInputForm, randomPassword);
    userEvent.click(roleOptions[1]);

    expect(nameInputForm).toHaveValue(randomName);
    expect(emailInputForm).toHaveValue(randomEmail);
    expect(passwordInputForm).toHaveValue(randomPassword);

    expect(submitButton).not.toBeDisabled();

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce({
      id: 3,
      name: randomName,
      email: randomEmail,
      role: 'seller',
      // token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxMCwibmFtZSI6ImRnYWRnZGFhZ2dnZGFnZCIsImVtYWlsIjoiZ2RoZGdhQGRlbGl2ZXJ5YXBwLmNvbSIsInJvbGUiOiJjdXN0b21lciJ9LCJpYXQiOjE2NzM5NzcxMDAsImV4cCI6MTY4MjUzMDcwMH0.If9oim5tRw2mF0ULhX-CmGpS1zzmJq53mDGvdfDmh7I',
    });

    userEvent.click(submitButton);

    // const renderedUserNumber = await screen.findByText('4');
    // const renderedName = await screen.findByText(randomName);
    // const renderedEmail = await screen.findByText(randomEmail);

    // expect(renderedUserNumber).toBeInTheDocument();
    // expect(renderedName).toBeInTheDocument();
    // expect(renderedEmail).toBeInTheDocument();
  });
  it.skip('Testa o remoção e adição de usuários com fracasso', async () => {
    const { history } = renderWithRouter(<App />);

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, expectedResponse.data.email);
    userEvent.type(passwordInput, '--adm2@21!!--');

    userEvent.click(loginButton);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: users });

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/admin/manage');
    });

    jest.spyOn(httpRequest, 'delete').mockResolvedValueOnce();

    const deleteUserButtons = await screen.findAllByRole('button');

    userEvent.click(deleteUserButtons[2]);

    const nameInputForm = screen.getByPlaceholderText(/seu nome/i);
    const emailInputForm = screen
      .getByPlaceholderText(/seu-email@site.com.br/i);
    const passwordInputForm = screen
      .getByPlaceholderText('**********');
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    const roleOptions = screen.getAllByRole('option');

    expect(submitButton).toBeDisabled();

    userEvent.type(nameInputForm, randomName);
    userEvent.type(emailInputForm, randomEmail);
    userEvent.type(passwordInputForm, randomPassword);
    userEvent.click(roleOptions[1]);

    expect(nameInputForm).toHaveValue(randomName);
    expect(emailInputForm).toHaveValue(randomEmail);
    expect(passwordInputForm).toHaveValue('senha123*!');

    expect(submitButton).not.toBeDisabled();

    // jest.spyOn(httpRequest, 'post').mockRejectedValueOnce(new Error());

    // userEvent.click(submitButton);

    // const renderedUserNumber = await screen.findByText('4');
    // const renderedName = await screen.findByText('Algum nome qualquer');
    // const renderedEmail = await screen.findByText('algumemail@email.com');

    // expect(renderedUserNumber).toBeInTheDocument();
    // expect(renderedName).toBeInTheDocument();
    // expect(renderedEmail).toBeInTheDocument();
  });
});
