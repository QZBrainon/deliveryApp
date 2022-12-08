import { useEffect, useState } from 'react';
// import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import httpRequest from '../axios/config';

export default function Products() {
  const [fetchedProducts, setFetchedProducts] = useState([]);

  const fetchProducts = async () => {
    const { data } = await httpRequest.get('/products');
    setFetchedProducts(data);
  };

  const renderProducts = () => fetchedProducts.map((i) => (
    <ProductCard
      key={ i.id }
      name={ i.name }
      price={ i.price }
      urlImage={ i.urlImage }
    />));

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      {/* <Header /> */}
      {renderProducts()}
    </div>
  );
}
