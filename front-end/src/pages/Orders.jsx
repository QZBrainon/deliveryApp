import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import HeaderSeller from '../components/HeaderSeller';
import OrderCard from '../components/OrderCard';
import httpRequest from '../axios/config';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [roleState, setRoleState] = useState('');

  const user = localStorage.getItem('user');
  const { role, token } = JSON.parse(user);

  useEffect(() => {
    const getOrders = async () => {
      const { data } = await httpRequest.get('/sales', {
        headers: {
          authorization: token,
        },
      });
      setOrders(data);
      console.log(data);
      setRoleState(role);
    };
    getOrders();
  }, []);

  return (
    <div>
      {user?.role === 'customer' ? <Header /> : <HeaderSeller />}
      <h1>Meus Pedidos</h1>
      <div className="list">
        { orders.length > 0
          ? orders.map((i) => (
            <OrderCard
              key={ i.id }
              id={ i.id }
              status={ i.status }
              date={ i.saleDate }
              price={ i.totalPrice }
              role={ roleState }
              deliveryAddress={ i.deliveryAddress }
              deliveryNumber={ i.deliveryNumber }
            />
          )) : <p>Não há pedidos</p> }
      </div>
    </div>
  );
}
export default Orders;
