import { useEffect, useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import httpRequest from '../axios/config';

export default function Products() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState([]);
  const [renderizar, setRenderizar] = useState(false);

  const fetchUsers = async (tokenLocStorage) => {
    // console.log('meu token do estado:', token);
    const { data } = await httpRequest.get('/users', {
      headers: { authorization: tokenLocStorage } });
    setUsers(data);
  };

  const getToken = async () => {
    const userJSON = localStorage.getItem('user');
    const user = JSON.parse(userJSON);
    // console.log('meu token:', user.token);
    setToken(user.token);
    await fetchUsers(user.token);
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
        onClick={ async () => {
          await httpRequest.delete(`/users/${user.id}`, {
            headers: { authorization: token } });
          return setRenderizar(!renderizar);
        } }
        data-testid={ `admin_manage__element-user-table-remove-${index + 1}` }
      >
        Excluir
      </button>
    </div>
  ));

  useEffect(() => {
    getToken();
  }, [renderizar]);

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div>
      <HeaderAdmin />
      <div>TELA DE CADASTRO DE USUÁRIOS</div>
      {users && renderUsers()}
    </div>
  );
}
