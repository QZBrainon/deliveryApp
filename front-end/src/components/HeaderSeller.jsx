import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function HeaderSeller() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  const navigate = useNavigate();

  const getNameRole = () => {
    const userJSON = localStorage.getItem('user');
    const user = JSON.parse(userJSON);
    setName(user.name);
    setRole(user.role);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    return navigate('/');
  };

  useEffect(() => {
    getNameRole();
  }, []);

  return (
    <div>
      {role === 'seller'
        ? (
          <div
            data-testid="seller_products__element-navbar-link-orders"
          >
            Pedidos
          </div>
        )
        : (
          <div>
            <button
              type="button"
              onClick={ () => navigate('/seller/products') }
              data-testid="seller_products__element-navbar-link-products"
            >
              Produtos
            </button>
            <button
              type="button"
              onClick={ () => navigate('/seller/orders') }
              data-testid="seller_products__element-navbar-link-orders"
            >
              Meus pedidos
            </button>
          </div>
        )}
      <p data-testid="seller_products__element-navbar-user-full-name">{name}</p>
      <button
        type="button"
        onClick={ logOut }
        data-testid="seller_products__element-navbar-link-logout"
      >
        Sair
      </button>
    </div>
  );
}
