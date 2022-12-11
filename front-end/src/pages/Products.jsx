import { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import httpRequest from '../axios/config';
import context from '../context/context';

export default function Products() {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const { cartValue } = useContext(context);

  const fetchProducts = async () => {
    const { data } = await httpRequest.get('/products');
    // const products = JSON.parse(productsJSON);
    console.log(data);
    setFetchedProducts(data);
  };

  const renderProducts = () => fetchedProducts.map((i) => (<ProductCard
    key={ i.id }
    id={ i.id }
    name={ i.name }
    price={ i.price }
    urlImage={ i.urlImage }
  />));

  // const createCart = () => {
  //   const itemsWithQty = fetchedProducts.map((i) => ({
  //     key: i.id,
  //     id: i.id,
  //     name: i.name,
  //     price: i.price,
  //     urlImage: i.urlImage,
  //     qty: 0,
  //   }));
  //   localStorage.setItem('cart', itemsWithQty);
  // };

  useEffect(() => {
    fetchProducts();
    localStorage.setItem('cart', JSON.stringify([]));
  }, []);

  return (
    <div>
      <Header />
      <button type="button" data-testid="customer_products__checkout-bottom-value">
        Ver carrinho:
        {' '}
        {cartValue
          .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
      </button>
      {fetchedProducts && renderProducts()}
    </div>
  );
}
