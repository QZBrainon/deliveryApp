import React, { useContext, useEffect, useState } from 'react';
import context from '../context/context';
import Header from '../components/Header';
import httpRequest from '../axios/config';

export default function Checkout() {
  const [sellers, setSellers] = useState([]); // state com os nomes dos vendedores vindos do fetch
  const [address, setAddress] = useState('');
  const [salesPerson, setSalesPerson] = useState(''); // state
  const [num, setNum] = useState('');
  const { cartValue } = useContext(context);
  const cartItems = JSON.parse(localStorage.getItem('cartItems'));

  const fetchSellersInfo = async () => {
    const { data } = await httpRequest.get('/users/sellers');
    setSellers(data);
  };

  const submitSale = async () => {
    await httpRequest.post('/sales', {
      userId: 'userId que deve vir na resposta do login ou register', // TO DO: incluir id do user na response do login/register
      sellerId: sellers.id,
      totalPrice: cartValue,
      deliveryAddress: address,
      deliveryNumber: num,
      products: 'array com formato que deve ser recebido no backend',
    });
  };

  useEffect(() => {
    fetchSellersInfo();
  }, []);

  const renderCartItems = cartItems.map((item, index) => (

    <tbody key={ item.id }>
      <tr>
        <td
          data-testid={ `customer_checkout__element-order-table-item-number-${index}` }
        >
          {index + 1}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-name-${index}` }
        >
          {item.name}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-quantity-${index}` }
        >
          {item.qty}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-unit-price-${index}` }
        >
          {item.price}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-sub-total-${index}` }
        >
          {(item.price * item.qty).toFixed(2)}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-remove-${index}` }
        >
          <button type="button">Remover</button>

        </td>
      </tr>
    </tbody>

  ));
  return (
    <>
      <Header />
      <h2>Finalizar Pedido</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-Total</th>
            <th>Remover item</th>
          </tr>
        </thead>
        {renderCartItems}
      </table>
      <div data-testid="customer_checkout__element-order-total-price">
        Total: R$
        {' '}
        {cartValue > 0 ? cartValue?.toFixed(2) : 0.00}
      </div>
      <h2>Detalhes e Endereço para Entrega</h2>
      <div>
        <label htmlFor="salesperson">
          P. Vendedora Responsável
          <select
            name="salesperson"
            id="salesperson"
          >
            {sellers.map((seller) => (
              <option
                key={ seller.id }
                data-testid="customer_checkout__select-seller"
                value={ salesPerson && seller.name }
                onChange={ ({ target }) => setSalesPerson(target.value) }
              >
                {seller.name}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="address">
          Endereço
          <input
            type="text"
            data-testid="customer_checkout__input-address"
            id="address"
            placeholder="Digite seu endereço completo"
            value={ address }
            onChange={ (e) => setAddress(e.target.value) }
          />
        </label>
        <label htmlFor="numero">
          Número
          <input
            type="text"
            data-testid="customer_checkout__input-address-number"
            id="numero"
            placeholder="123"
            value={ num }
            onChange={ ({ target }) => setNum(target.value) }
          />
        </label>
        <button
          type="button"
          data-testid="customer_checkout__button-submit-order"
          onClick={ submitSale }
        >
          FINALIZAR PEDIDO

        </button>
      </div>
    </>
  );
}
