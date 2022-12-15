import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import httpRequest from '../axios/config';
import Header from '../components/Header';
import HeaderSeller from '../components/HeaderSeller';

export default function OrdersDetail() {
  const [orderDetails, setOrderDetails] = useState();
  const [erro, setErro] = useState(false);
  const [renderizar, setRenderizar] = useState(false);
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem('user'));

  const updateStatus = async (status) => {
    try {
      const result = await httpRequest.patch(`/sales/${id}`, { status });
      console.log(result);
      setOrderDetails({ ...orderDetails, status });
    } catch (error) {
      setErro(true);
    }
  };

  const fetchOrderDetails = async (saleId) => {
    const { data } = await httpRequest.get(`/sales/${saleId}`, {
      headers: {
        Authorization: user?.token,
      },
    });
    console.log(data);
    setOrderDetails(data);
  };

  useEffect(() => {
    fetchOrderDetails(id);
    console.log('STATE ORDER DETAILS', orderDetails);
  }, []);

  useEffect(() => {
    fetchOrderDetails(id);
  }, [renderizar]);

  return (
    <>
      {user?.role === 'customer' ? <Header /> : <HeaderSeller />}
      <h2>Detalhes do Pedido</h2>
      <div>
        <div
          style={ { diplay: 'flex',
            justifyContent: 'center',
            alignItems: 'center' } }
        >
          {/* <label
            data-testid={ `${user?.role}_order_details__element
          -order-details-label-order-id` }
          >
            Pedido
            {' '}
            {orderDetails?.id}
          </label> */}

          <p
            data-testid={ `${user?.role}_order_details__element`
            + '-order-details-label-order-id' }
          >
            Pedido
            {' '}
            {orderDetails?.id}
          </p>
          <p
            data-testid={ `${user?.role}_order_details__element`
            + '-order-details-label-seller-name' }
          >
            P Vend:
            {' '}
            {orderDetails?.seller.name}
          </p>
          <p
            data-testid={ `${user?.role}_order_details__element`
            + '-order-details-label-order-date' }
          >
            {new Date(orderDetails?.saleDate).toLocaleDateString('pt-br')}

          </p>
          <p
            data-testid={ `${user?.role}_order_details__element`
            + '-order-details-label-delivery-status' }
          >
            {orderDetails?.status}

          </p>
          {user?.role === 'customer'
            ? (
              <button
                type="button"
                data-testid={ `${user?.role}_order_details__button-delivery-check` }
                disabled={ orderDetails?.status !== 'Em Trânsito' }
                onClick={ () => {
                  updateStatus('Entregue');
                  setRenderizar(!renderizar);
                } }
              >
                Marcar como entregue
              </button>)
            : (
              <div>
                <button
                  type="button"
                  data-testid={ `${user?.role}_order_details__button-preparing-check` }
                  disabled={ orderDetails?.status !== 'Pendente' }
                  onClick={ () => {
                    updateStatus('Preparando');
                    setRenderizar(!renderizar);
                  } }
                >
                  PREPARAR PEDIDO
                </button>
                <button
                  type="button"
                  data-testid={ `${user?.role}_order_details__button-dispatch-check` }
                  disabled={ orderDetails?.status !== 'Preparando' }
                  onClick={ () => {
                    updateStatus('Em Trânsito');
                    setRenderizar(!renderizar);
                  } }
                >
                  SAIU PARA ENTREGA
                </button>
              </div>
            )}
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
                data-testid={ `${user?.role}_order_details__element-`
                + `order-table-item-number-${index}` }
              >
                {index + 1}

              </td>
              <td
                data-testid={ `${user?.role}_order_details__element-order`
                + `-table-name-${index}` }
              >
                {sale.name}

              </td>
              <td
                data-testid={ `${user?.role}_order_details__element-order`
                + `-table-quantity-${index}` }
              >
                {sale.qtd.quantity}

              </td>
              <td
                data-testid={ `${user?.role}_order_details__element-order`
                + `-table-unit-price-${index}` }
              >
                {Number(sale.price)
                  .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}

              </td>
              <td
                data-testid={
                  `${user?.role}_order_details__element-order`
                  + `-table-sub-total-${index}`
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
        data-testid={ `${user?.role}_order_details__element`
        + '-order-total-price' }
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
