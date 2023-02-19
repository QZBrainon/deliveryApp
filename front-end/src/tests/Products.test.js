import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './utils/RenderWithRouter';
import httpRequest from '../axios/config';
import products from './mocks/products';
// import { expect } from 'chai';
// import { expect } from 'chai';
// import { expect } from 'chai';

describe('Testa o Products', () => {
  const emailZebirita = 'zebirita@email.com';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
    + 'eyJkYXRhIjp7ImlkIjozLCJuYW1lIjoiQ2xpZW50ZSBaw6kgQmlyaXRhIiwiZW1haWwiOiJ6ZWJ'
    + 'pcml0YUBlbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZX'
    + 'IifSwiaWF0IjoxNjcwOTU2MDE4LCJleHAiOjE2Nzk1MDk2MTh9.'
    + 'qCdfvrHvSz8IP_nUAXDK0xsRlGFbIk_FvadFUDVYC1U';
  const loginButtonTestId = 'common_login__button-login';
  const deliveryAddress = 'endereco da minha casa';
  const deliveryNumber = '100';
  const fulanaPereira = 'Fulana Pereira';
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

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: products });

    const drinkName = await screen.findByText(/Skol Lata 250ml/i);
    const drinkPrice = await screen.findByText('R$ 2,20');
    const drinkImg = (await screen.findAllByAltText('Product'))[0];
    const addButton = (await screen.findAllByRole('button', { name: '+' }))[0];
    const addButtonTwo = (await screen.findAllByRole('button', { name: '+' }))[1];
    const removeButton = (await screen.findAllByRole('button', { name: '-' }))[0];
    const productQtyInput = await screen
      .findByTestId('customer_products__input-card-quantity-1');
    const cart = screen.getByRole('button', { name: 'Ver carrinho: 0' });

    expect(drinkName).toBeInTheDocument();
    expect(drinkPrice).toBeInTheDocument();
    expect(drinkImg).toBeInTheDocument();
    expect(drinkImg).toHaveAttribute('src', 'http://localhost:3001/images/skol_lata_350ml.jpg');
    expect(addButton).toBeInTheDocument();
    expect(removeButton).toBeInTheDocument();
    expect(productQtyInput).toBeInTheDocument();
    expect(productQtyInput).toHaveValue(0);
    expect(cart).toBeInTheDocument();

    userEvent.click(addButton);
    userEvent.click(addButtonTwo);

    expect(productQtyInput).toHaveValue(1);

    userEvent.click(removeButton);

    expect(productQtyInput).toHaveValue(0);

    userEvent.type(productQtyInput, '2');

    expect(productQtyInput).toHaveValue(2);

    userEvent.click(cart);

    const item = screen.getAllByText('1');
    const productName = screen.getByText(/Skol Lata 250ml/i);

    expect(item[0]).toBeInTheDocument();
    expect(productName).toBeInTheDocument();

    const sellerOptions = await screen.findAllByRole('option');

    userEvent.click(sellerOptions[0]);

    expect(sellerOptions[0]).toHaveAttribute('value', fulanaPereira);

    const addressInput = screen.getByTestId('customer_checkout__input-address');
    const numberInput = screen.getByTestId('customer_checkout__input-address-number');

    userEvent.type(addressInput, deliveryAddress);
    userEvent.type(numberInput, deliveryNumber);

    expect(addressInput).toHaveValue(deliveryAddress);
    expect(numberInput).toHaveValue(deliveryNumber);

    const removeFromCartButtons = await screen.findAllByRole('button', { name: /remover/i });

    userEvent.click(removeFromCartButtons[1]);

    const finishOrderButton = await screen
      .findByRole('button', { name: /finalizar pedido/i });

    const expectedReponseCheckout = { data: { id: 1,
      userId: 3,
      sellerId: 2,
      seller: { name: 'Fulana Pereira' },
      totalPrice: '4.40',
      deliveryAddress,
      deliveryNumber,
      saleDate: '2022-12-06T19:37:34.000Z',
      status: 'Pendente',
      products: [
        {
          id: 1,
          name: 'Skol Lata 250ml',
          price: '2.20',
          qtd: {
            quantity: 1,
          },
        }],
    } };

    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedReponseCheckout);

    userEvent.click(finishOrderButton);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce(expectedReponseCheckout);

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/customer/orders/1');
    });

    const myOrdersButton = screen.getByRole('button', { name: /meus pedidos/i });

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data:
      [
        {
          id: 1,
          userId: 3,
          sellerId: 2,
          totalPrice: '2.20',
          deliveryAddress,
          deliveryNumber,
          saleDate: '2023-01-18T02:04:23.000Z',
          status: 'Pendente',
        },
      ] });

    userEvent.click(myOrdersButton);

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/customer/orders');
    });

    const orderDetailsButton = screen.getAllByRole('button');

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: { id: 1,
      userId: 3,
      sellerId: 2,
      seller: { name: fulanaPereira },
      totalPrice: '4.40',
      deliveryAddress,
      deliveryNumber,
      saleDate: '2022-12-06T19:37:34.000Z',
      status: 'Em Trânsito',
      products: [
        {
          id: 1,
          name: 'Skol Lata 250ml',
          price: '2.20',
          qtd: {
            quantity: 1,
          },
        }],
    } });

    userEvent.click(orderDetailsButton[orderDetailsButton.length - 1]);

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/customer/orders/1');
    });

    const finishCurrentOrderButton = await screen
      .findByRole('button', { name: /marcar como entregue/i });

    jest.spyOn(httpRequest, 'patch').mockRejectedValueOnce('Qualquer coisa');

    expect(finishCurrentOrderButton).not.toBeDisabled();

    userEvent.click(finishCurrentOrderButton);
  });
});
