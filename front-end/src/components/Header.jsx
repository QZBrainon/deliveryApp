// import { useNavigate } from 'react-router-dom';
// import { useState, useEffect } from 'react';

// export default function Header() {
//   const [name, setName] = useState('');

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userJSON = localStorage.getItem('user');
//     const user = JSON.parse(userJSON);
//     console.log(user);
//     setName(user.name);
//   }, []);

//   return (
//     <div>
//       <button
//         type="button"
//         // onClick={ navigate('/customer/products') }
//         data-testid="customer_products__element-navbar-link-products"
//       >
//         Produtos
//       </button>
//       <button
//         type="button"
//         onClick={ navigate('/customer/pedidos') }
//         data-testid="customer_products__element-navbar-link-orders"
//       >
//         Meus pedidos
//       </button>
//       <p data-testid="customer_products__element-navbar-user-full-name">{name}</p>
//       <button
//         type="button"
//         onClick={ navigate('/') }
//         data-testid="customer_products__element-navbar-link-logout"
//       >
//         Logout
//       </button>
//     </div>
//   );
// }
