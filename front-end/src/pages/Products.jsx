import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import httpRequest from '../axios/config';
import context from '../context/context';

export default function Products() {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const { cartValue } = useContext(context);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    const { data } = await httpRequest.get('/products');
    setFetchedProducts(data);
  };

  const renderProducts = () => fetchedProducts.map((i) => (<ProductCard
    key={ i.id }
    id={ i.id }
    name={ i.name }
    price={ i.price }
    urlImage={ i.urlImage }
  />));

  useEffect(() => {
    fetchProducts();
    if (cartValue) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [cartValue]);

  return (
    <div>
      <Header />
      <button
        type="button"
        data-testid="customer_products__button-cart"
        onClick={ () => navigate('/customer/checkout') }
        disabled={ isDisabled }
      >
        Ver carrinho:
        {' '}
        <span data-testid="customer_products__checkout-bottom-value">
          {
            cartValue
          && cartValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
          }
        </span>
      </button>
      {fetchedProducts && renderProducts()}
    </div>
  );
}
