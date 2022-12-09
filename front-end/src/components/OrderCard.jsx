import PropTypes from 'prop-types';

export default function OrderCard({ id, price, date, status }) {
  const TIME_MIN = 3;

  return (
    <div
      style={ {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      } }
    >
      <h5 data-testid={ `customer_orders__element-order-id-${id}` }>
        {`Pedidos: ${id.toString().padStart(TIME_MIN, '0')}`}
      </h5>
      <h2 data-testid={ `customer_orders__element-delivery-status-${id}` }>{status}</h2>
      <h3
        data-testid={ `customer_orders__element-order-date-${id}` }
      >
        {date}
      </h3>
      <div data-testid={ `customer_orders__element-card-price-${id}` }>{price}</div>
    </div>
  );
}

OrderCard.propTypes = {
  id: PropTypes.number.isRequired,
  price: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};
