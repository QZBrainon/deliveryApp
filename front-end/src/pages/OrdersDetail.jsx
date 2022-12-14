import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpRequest from '../axios/config';
import Header from '../components/Header';

export default function OrdersDetail() {
  const [orderDetails, setOrderDetails] = useState();
  const { id } = useParams();

  // const updateStatus = () => {
  //   // chama a API na route que atualiza o status para Entregue
  // };

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
            {(orderDetails?.saleDate)}

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
            // onClick={ updateStatus }
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
                {(sale.price).replace('.', ',')}

              </td>
              <td
                data-testid={
                  `customer_order_details__element-order
                  -table-sub-total-${index}`
                }
              >
                {
                  (sale.price * sale.qtd.quantity).toFixed(2).replace('.', ',')
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
          orderDetails?.totalPrice
        }
      </div>
    </>
  );
}
