import { useEffect, useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import httpRequest from '../axios/config';

export default function Products() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState([]);

  const getToken = () => {
    const userJSON = localStorage.getItem('user');
    const user = JSON.parse(userJSON);
    setToken(user.token);
  };

  const fetchUsers = async () => {
    const { data } = await httpRequest.get('/users', {
      headers: { Authorization: token } });
    // const products = JSON.parse(productsJSON);
    console.log(data);
    setUsers(data);
  };

  const renderUsers = () => users.map((user, index) => (
    <div key={ index }>
      <div data-testid={ `admin_manage__element-user-table-item-number-${index + 1}` }>
        {index + 1}
      </div>
      <div data-testid={ `admin_manage__element-user-table-name-${index + 1}` }>
        {user.name}
      </div>
      <div data-testid={ `admin_manage__element-user-table-email-${index + 1}` }>
        {user.email}
      </div>
      <div data-testid={ `admin_manage__element-user-table-role-${index + 1}` }>
        {user.role}
      </div>
      <button
        type="button"
        onClick={ () => {} }
        data-testid={ `admin_manage__element-user-table-remove-${index + 1}` }
      >
        {user.name}
      </button>
    </div>
  ));

  useEffect(() => {
    getToken();
    fetchUsers();
  }, []);

  return (
    <div>
      <HeaderAdmin />
      {users && renderUsers()}
    </div>
  );
}
