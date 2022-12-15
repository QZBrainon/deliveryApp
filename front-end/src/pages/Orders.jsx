import React from 'react';
import Header from '../components/Header';
import OrderCard from '../components/OrderCard';
import userSales from '../mock/salesMock';
// import httpRequest from '../axios/config';

function Orders() {
  // const [orders, setOrders] = useState([]);

   const fetchOrders = async () => {
     await httpRequest.get('')
       .then(({ data }) => {
         setOrders(data);
       });
   };

  // const renderOrders = () => fetchOrders.map((i) => (<OrderCard
  //   key={ i.id }
  //   id={ i.id }
  //   date={ i.date }
  //   status={ i.status }
  //   price={ i.price }
  // />));

   useEffect(() => {
     fetchOrders();
   }, []);

  return (
    <>
      <Header />
      <section>
        {userSales.map((i) => (<OrderCard
          key={ i.id }
          id={ i.id }
          date={ i.saleDate.toLocaleDateString() }
          status={ i.status }
          price={ i.total_price }
        />))}
      </section>
    </>
  );
}

export default Orders;
