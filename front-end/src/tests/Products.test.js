import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';
import products from './mocks/products';

describe('Testa o Products', () => {
  const emailZebirita = 'zebirita@email.com';
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

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, emailZebirita);
    userEvent.type(passwordInput, '$#zebirita#$');

    userEvent.click(loginButton);

    console.log(history.pathname);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: products });

    const drinkName = await screen.findByText(/Skol Lata 250ml/i);
    const drinkPrice = await screen.findByText('R$ 2,20');
    const drinkImg = (await screen.findAllByAltText('Product'))[0];
    const addButton = (await screen.findAllByRole('button', { name: '+' }))[0];
    const removeButton = (await screen.findAllByRole('button', { name: '-' }))[0];
    const productQtyInput = await screen
      .findByTestId('customer_products__input-card-quantity-1');
    const cart = await screen
      .getByRole('button', { name: 'Ver carrinho: 0' });
    // .findByTestId('customer_products__button-cart');

    expect(drinkName).toBeInTheDocument();
    expect(drinkPrice).toBeInTheDocument();
    expect(drinkImg).toBeInTheDocument();
    expect(drinkImg).toHaveAttribute('src', 'http://localhost:3001/images/skol_lata_350ml.jpg');
    expect(addButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    expect(productQtyInput).toBeInTheDocument();
    expect(productQtyInput).toHaveValue(0);
    expect(cart).toBeInTheDocument();
    // expect(cart).toHaveValue('Ver carrinho: R$ 0,00');

    userEvent.click(addButton);

    expect(productQtyInput).toHaveValue(1);

    // const cartValue = (await screen
    //   .findAllByText('R$ 2,20'))[0];
    // expect(cartValue).toBeInTheDocument();
    // console.log(cartValue);

    // userEvent.click(removeButton);

    // expect(productQtyInput).toHaveValue(0);

    // userEvent.type(productQtyInput, '2');

    // expect(productQtyInput).toHaveValue(2);
  });
});
