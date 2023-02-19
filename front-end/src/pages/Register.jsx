import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import useGenericState from '../Hooks/useGenericState';
import httpRequest from '../axios/config';

export default function Register() {
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, serError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await httpRequest.post('/users', { name, email, password });
      console.log(error);
      localStorage.setItem('user', JSON.stringify(data));
      navigate('/customer/products');
    } catch (err) {
      serError(true);
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

  useEffect(() => {
    validate();
  }, [name, email, password]);

  return (
    <div className="register-container">
      <h1>Cadastro</h1>

      <form className="register-form">
        <label className="label-form" htmlFor="name">
          Nome
          <input
            data-testid="common_register__input-name"
            className="input-form"
            type="text"
            id="name"
            name="name"
            value={ name }
            placeholder="Seu Nome"
            onChange={ ({ target }) => setName(target.value) }
          />
        </label>

        <label className="label-form" htmlFor="email">
          Email
          <input
            data-testid="common_register__input-email"
            className="input-form"
            type="email"
            id="email"
            name="email"
            placeholder="seu-email@site.com.br"
            value={ email }
            onChange={ ({ target }) => setEmail(target.value) }
          />
        </label>

        <label className="label-form" htmlFor="password">
          Senha
          <input
            data-testid="common_register__input-password"
            className="input-form"
            type="password"
            id="password"
            name="password"
            placeholder="**********"
            value={ password }
            onChange={ ({ target }) => setPassword(target.value) }

          />
        </label>

        <button
          data-testid="common_register__button-register"
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
            <p data-testid="common_register__element-invalid_register">
              Cadastro Inválido
            </p>)
          : null}
      </div>
    </div>
  );
}
