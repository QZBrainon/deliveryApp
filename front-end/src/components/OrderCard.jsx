import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

export default function OrderCard({ id, status, date, price, role }) {
  const navigate = useNavigate();

  const rawDate = date.split('T')[0];
  const [year, month, day] = rawDate.split('-');
  const formartedDate = `${day}/${month}/${year}`;

  const handleClick = () => {
    navigate(`/${role}/orders/${id}`);
  };

  return (
    <div
      style={ {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      } }
    >
      <div
        className="cardOrders"
        onClick={ handleClick }
        onKeyDown={ handleClick }
        role="button"
        tabIndex={ 0 }
      >
        <span>Pedido </span>
        <span data-testid={ `${role}_orders__element-order-id-${id}` }>{ id }</span>
        <p data-testid={ `${role}_orders__element-delivery-status-${id}` }>{ status }</p>
        <p
          data-testid={
            `${role}_orders__element-order-date-${id}`
          }
        >
          { formartedDate}

        </p>
        <p
          data-testid={ `${role}_orders__element-card-price-${id}` }
        >
          { price.replace('.', ',') }
        </p>
      </div>
    </div>
  );
}

OrderCard.propTypes = {
  id: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};
