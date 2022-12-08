import { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import httpRequest from '../axios/config';

export default function Products() {
  const [fetchedProducts, setFetchedProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await httpRequest.get('/products');
    // const products = JSON.parse(productsJSON);
    console.log(data);
    setFetchedProducts(data);
  };

  const renderProducts = () => fetchedProducts.forEach((i) => (<ProductCard
    id={ i.id }
    name={ i.name }
    price={ i.price }
    urlImage={ i.urlImage }
  />));

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <Header />
      {fetchedProducts && renderProducts()}
    </div>
  );
}
