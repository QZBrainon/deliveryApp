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
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.'
  + 'eyJkYXRhIjp7ImlkIjoyLCJuYW1lIjoiRnVsYW5hIFBlcmVpcmEiL'
  + 'CJlbWFpbCI6ImZ1bGFuYUBkZWxpdmVyeWFwcC5jb20iLCJyb2xlIjo'
  + 'ic2VsbGVyIn0sImlhdCI6MTY3NDAxMzY1OSwiZXhwIjoxNjgyNTY3Mj'
  + 'U5fQ.6cTpREWx_Pj5UPkHYRIBPSPcRrkk7T6j_3qWgNulyU4';
  const loginButtonTestId = 'common_login__button-login';
  const deliveryAddress = 'endereco da minha casa';
  const deliveryNumber = '100';
  it('Testa os inputs como customer', async () => {
    const { history } = renderWithRouter(<App />);

    const expectedResponse = { data: {
      id: 2,
      name: 'Fulana Pereira',
      email: 'fulana@deliveryapp.com',
      role: 'seller',
      token,
    } };
    jest.spyOn(httpRequest, 'post').mockResolvedValueOnce(expectedResponse);

    const emailInput = screen.getByPlaceholderText('email');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByTestId(loginButtonTestId);

    userEvent.type(emailInput, expectedResponse.data.email);
    userEvent.type(passwordInput, 'fulana@123');

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

    userEvent.click(loginButton);

    await waitFor(() => {
      // console.log(history.pathname);
      expect(history.pathname).toBe('/seller/orders');
    });

    const orderDetails = await screen.findByText(/pendente/i);

    jest.spyOn(httpRequest, 'get').mockResolvedValueOnce({ data: { id: 1,
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
    } });

    userEvent.click(orderDetails);

    const prepareOrderButton = await screen
      .findByRole('button', { name: /preparar pedido/i });

    expect(prepareOrderButton).not.toBeDisabled();

    jest.spyOn(httpRequest, 'patch').mockResolvedValueOnce('Qualquer coisa');

    userEvent.click(prepareOrderButton);

    const orderLeftButton = await screen
      .findByRole('button', { name: /saiu para entrega/i });

    jest.spyOn(httpRequest, 'patch').mockResolvedValueOnce('Qualquer coisa');

    userEvent.click(orderLeftButton);
  });
});
