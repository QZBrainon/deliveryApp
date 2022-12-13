import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import httpRequest from '../axios/config';

function Orders() {
  const [orders, setOrders] = useState([]);
  // const [token, setToken] = useState([]);
  const [roleState, setRoleState] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      const user = localStorage.getItem('user');
      const { role, token } = JSON.parse(user);
      const { data } = await httpRequest.get('/sales', {
        headers: {
          authorization: token,
        },
      });
      setOrders(data);
      setRoleState(role);
    };
    getOrders();
  }, []);

  return (
    <div>
      <Header />
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
            />
          )) : <p>Não há pedidos</p> }
      </div>
    </div>
  );
}
export default Orders;
