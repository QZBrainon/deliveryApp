import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpRequest from '../axios/config';
import Header from '../components/Header';

export default function OrdersDetail() {
  const [orderDetails, setOrderDetails] = useState();
  const [erro, setErro] = useState(false);
  const { id } = useParams();

  const updateStatus = async () => {
    // chama a API na route que atualiza o status para Entregue
    try {
      const result = await httpRequest.patch(`/sales/${id}`, { status: 'Entregue' });
      console.log(result);
      setOrderDetails({ ...orderDetails, status: 'Entregue' });
    } catch (error) {
      setErro(true);
    }
  };

  useEffect(() => {
    const fetchOrderDetails = async (saleId) => {
      const { data } = await httpRequest.get(`/sales/${saleId}`, {
        headers: {
          Authorization: JSON.parse(localStorage.getItem('user')).token,
        },
      });
      console.log(data);
      setOrderDetails(data);
    };
    fetchOrderDetails(id);
    console.log('STATE ORDER DETAILS', orderDetails);
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
          <p data-testid="customer_order_details__element-order-details-label-order-id">
            Pedido
            {' '}
            {orderDetails?.id}
          </p>
          <p
            data-testid="customer_order_details__element-order-details-label-seller-name"
          >
            P Vend:
            {' '}
            {orderDetails?.seller.name}
          </p>
          <p
            data-testid="customer_order_details__element-order-details-label-order-date
"
          >
            {new Date(orderDetails?.saleDate).toLocaleDateString('pt-br')}

          </p>
          <p
            data-testid="customer_order_details__element-order-details-
            label-delivery-status"
          >
            {orderDetails?.status}

          </p>
          <button
            type="button"
            data-testid="customer_order_details__button-delivery-check"
            disabled={ orderDetails?.status === 'Entregue' }
            onClick={ () => updateStatus() }
          >
            Marcar como entregue

          </button>
          {erro && <p>Erro ao atualizar status</p>}
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
        {orderDetails?.products.map((sale, index) => (
          <tbody key={ sale.id }>
            <tr>
              <td
                data-testid={ `customer_order_details__element-
                order-table-item-number-${index}` }
              >
                {index + 1}

              </td>
              <td
                data-testid={ `customer_order_details__element-order
                -table-name-${index}` }
              >
                {sale.name}

              </td>
              <td
                data-testid={ `customer_order_details__element-order
              -table-quantity-${index}` }
              >
                {sale.qtd.quantity}

              </td>
              <td
                data-testid={ `customer_order_details__element-order
              -table-unit-price-${index}` }
              >
                {Number(sale.price)
                  .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}

              </td>
              <td
                data-testid={
                  `customer_order_details__element-order
                  -table-sub-total-${index}`
                }
              >
                {
                  Number((sale.price * sale.qtd.quantity))
                    .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                }

              </td>
            </tr>
          </tbody>
        ))}
      </div>
      <div
        data-testid="customer_order_details__element
      -order-total-price"
      >
        Total:
        {' '}
        {
          Number(orderDetails?.totalPrice)
            .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        }
      </div>
    </>
  );
}
