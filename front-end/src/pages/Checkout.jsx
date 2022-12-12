import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import context from '../context/context';
import Header from '../components/Header';
import httpRequest from '../axios/config';

export default function Checkout() {
  const [sellers, setSellers] = useState([]); // state com os nomes dos vendedores vindos do fetch
  const [address, setAddress] = useState('');
  const [salesPerson, setSalesPerson] = useState(0); // state para guardar o id do vendedor
  const [num, setNum] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const { cartValue, setCartValue } = useContext(context);
  const navigate = useNavigate();

  const fetchSellersInfo = async () => {
    const { data } = await httpRequest.get('/users/sellers');
    setSellers(data);
    setSalesPerson(data[0].id);
  };

  const deleteItemFromCart = (id) => {
    if (cartItems) {
      const result = cartItems.filter((item) => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(result));
      setCartItems(result);
      setCartValue(result.reduce((acc, item) => item.price * item.qty + acc, 0));
    }
  };

  const submitSale = async () => {
    const { data } = await httpRequest.post('/sales', {
      userId: +(JSON.parse(localStorage.getItem('user')).id),
      sellerId: salesPerson,
      totalPrice: +(cartValue),
      deliveryAddress: address,
      deliveryNumber: num,
      products: cartItems.map((item) => ({ id: item.id, quantity: item.qty })),
    }, {
      headers: {
        Authorization: JSON.parse(localStorage.getItem('user')).token,
      },
    });
    navigate(`/customer/orders/${data.id}`);
  };

  useEffect(() => {
    fetchSellersInfo();
    setCartItems(JSON.parse(localStorage.getItem('cartItems')));
    console.log(JSON.parse(localStorage.getItem('user')).token);
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
          {(item.price).replace('.', ',')}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-sub-total-${index}` }
        >
          {(item.price * item.qty).toFixed(2).replace('.', ',')}

        </td>
        <td
          data-testid={ `customer_checkout__element-order-table-remove-${index}` }
        >
          <button
            type="button"
            onClick={ () => deleteItemFromCart(item.id) }
          >
            Remover

          </button>

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
        {cartValue > 0 ? cartValue?.toFixed(2).replace('.', ',') : 0.00}
      </div>
      <h2>Detalhes e Endereço para Entrega</h2>
      <div>
        <label htmlFor="salesperson">
          P. Vendedora Responsável
          <select
            data-testid="customer_checkout__select-seller"
            id="salesperson"
          >
            {sellers.map((seller) => (
              <option
                key={ seller.id }
                id={ seller.id }
                value={ seller.name }
                onChange={ ({ target }) => setSalesPerson(+(target.id)) }
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
          onClick={ () => submitSale() }
        >
          FINALIZAR PEDIDO

        </button>
      </div>
    </>
  );
}
