import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpRequest from '../axios/config';
import Header from '../components/Header';

export default function OrdersDetail() {
  const [orderDetails, setOrderDetails] = useState({});
  const { id } = useParams();

  const updateStatus = () => {
    // chama a API na route que atualiza o status para Entregue
  };

  useEffect(() => {
    const fetctOrderDetails = async (saleId) => {
      const { data } = await httpRequest.post(`/sales/${saleId}`, {
        headers: JSON.parse(localStorage.getItem('user')).token,
      });
      setOrderDetails(data);
    };
    fetctOrderDetails(id);
  }, []);

  return (
    <>
      <Header />
      <h2>Detalhes do Pedido</h2>
      <div>
        <div
          style={ { diplay: 'flex',
            justifyContent: 'center',
            alignItems: 'center' } }
        >
          <p>
            Pedido
            {' '}
            {orderDetails.id}
          </p>
          <p>
            P Vend:
            {' '}
            {orderDetails.seller}
          </p>
          <p>{orderDetails.saleDate}</p>
          <p>{orderDetails.status}</p>
          <button
            type="button"
            onClick={ updateStatus }
          >
            Marcar como entregue

          </button>
        </div>
        <thead>
          <tr>
            <th>Item</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Valor Unitário</th>
            <th>Sub-Total</th>
          </tr>
        </thead>
        {orderDetails.map((sale, index) => (
          <tbody key={ sale.id }>
            <tr>
              <td>{index + 1}</td>
              <td>{sale.description}</td>
              <td>{sale.qty}</td>
              <td>{sale.price}</td>
              <td>{(sale.price * qty)}</td>
            </tr>
          </tbody>

        ))}
      </div>
      <div>
        Total:
        {' '}
        {
          orderDetails.products.reduce((acc, product) => (
            (product.price * product.qty) + acc
          ), 0)
        }
      </div>
    </>
  );
}
