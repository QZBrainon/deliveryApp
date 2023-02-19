import { useEffect, useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import httpRequest from '../axios/config';

export default function Products() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState([]);
  const [renderizar, setRenderizar] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await httpRequest.post(
        '/users',
        { name, email, password, role },
        { headers: { authorization: token } },
      );
      setName('');
      setEmail('');
      setPassword('');
      setRole('');
      setRenderizar(!renderizar);
    } catch (err) {
      console.log(err.response.data.message);
      setError(true);
    }
  };

  const validate = () => {
    const regex = /\S+@\S+\.\S+/;
    const minNameLength = 12;
    const minPasswordLength = 6;

    if (name.length >= minNameLength
      && regex.test(email)
      && password.length >= minPasswordLength) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

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

  const renderRegisterForm = () => (
    <div className="admin-register-container">
      <h1>Cadastrar novo usuário</h1>
      <form className="admin-register-form">
        <label className="label-form" htmlFor="name">
          Nome
          <input
            data-testid="admin_manage__input-name"
            className="input-form"
            type="text"
            id="name"
            name="name"
            value={ name }
            placeholder="Seu Nome"
            onChange={ ({ target }) => {
              setName(target.value);
              setError(false);
            } }
          />
        </label>

        <label className="label-form" htmlFor="email">
          Email
          <input
            data-testid="admin_manage__input-email"
            className="input-form"
            type="email"
            id="email"
            name="email"
            placeholder="seu-email@site.com.br"
            value={ email }
            onChange={ ({ target }) => {
              setEmail(target.value);
              setError(false);
            } }
          />
        </label>

        <label className="label-form" htmlFor="password">
          Senha
          <input
            data-testid="admin_manage__input-password"
            className="input-form"
            type="password"
            id="password"
            name="password"
            placeholder="**********"
            value={ password }
            onChange={ ({ target }) => setPassword(target.value) }

          />
        </label>

        <label className="label-form" htmlFor="role">
          Tipo
          <select
            data-testid="admin_manage__select-role"
            className="input-form"
            type="role"
            id="role"
            name="role"
            defaultValue="customer"
            onChange={ ({ target }) => setRole(target.value) }
          >
            <option value="customer">Cliente</option>
            <option value="seller">Vendedor</option>
          </select>
        </label>

        <button
          data-testid="admin_manage__button-register"
          type="submit"
          disabled={ isValid }
          onClick={ (e) => handleSubmit(e) }
        >
          CADASTRAR
        </button>
      </form>

      <div>
        {error
          ? (
            <p data-testid="admin_manage__element-invalid-register">
              Cadastro Inválido
            </p>)
          : null}
      </div>
    </div>);

  useEffect(() => {
    validate();
  }, [name, email, password, role]);

  useEffect(() => {
    getToken();
  }, [renderizar]);

  useEffect(() => {
    getToken();
  }, []);

  return (
    <div>
      <HeaderAdmin />
      {renderRegisterForm()}
      <br />
      <div>Lista de Usuários</div>
      <br />
      {users && renderUsers()}
    </div>
  );
}
