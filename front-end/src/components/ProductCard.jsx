import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import context from '../context/context';

export default function ProductCard({ id, name, price, urlImage }) {
  const [qty, setQty] = useState(0);
  const { cartValue, setCartValue } = useContext(context);

  useEffect(() => {
    setCartValue([qty * price]);
    console.log(cartValue);
  }, [qty]);

  return (
    <div
      style={ {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      } }
    >
      <p data-testid={ `customer_products__element-card-title-${id}` }>{name}</p>
      <p data-testid={ `customer_products__element-card-price-${id}` }>
        {Number(price)
          .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
      </p>
      <div>
        <img
          data-testid={ `customer_products__img-card-bg-image-${id}` }
          src={ urlImage }
          alt="Product"
        />
      </div>
      <div
        style={ {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        } }
      >
        <button
          type="button"
          data-testid={ `customer_products__button-card-add-item-${id}` }
          onClick={ () => setQty(qty + 1) }
        >
          +
        </button>
        <input
          type="number"
          data-testid={ `customer_products__input-card-quantity-${id}` }
          value={ qty }
          onChange={ (event) => setQty(event.target.value) }
        />
        <button
          type="button"
          data-testid={ `customer_products__button-card-rm-item-${id}` }
          onClick={ () => (qty > 0 && setQty(qty - 1)) }
        >
          -
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  urlImage: PropTypes.string.isRequired,
};
