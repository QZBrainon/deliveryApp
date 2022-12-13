import React, { useState, useEffect } from 'react';
import Header from '../components/Header'
import OrderCard from '../components/OrderCard';

function Orders() {
  const [orders, setOrders] = useState([]);
  // const [token, setToken] = useState([]);
  const [roleState, setRoleState] = useState('');

  useEffect(() => {
    const getOrders = async () => {
      const user = localStorage.getItem('user');
      const { id, role, token } = JSON.parse(user);
      const fetchOrders = await fetch(`http://localhost:3001/sales/user?id=${id}&role=${role}`, {
        method: 'GET',
        headers: {
          authorization: token,
        },
      });
      const ordersJson = await fetchOrders.json();
      setOrders(ordersJson);
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