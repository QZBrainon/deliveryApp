import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpRequest from '../axios/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const verifyLogin = (loginEmail, loginPassword) => {
    const PASSWORD_LENGHT = 6;
    const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const verifyEmail = EMAIL_REGEX.test(loginEmail);
    const verifyPassword = loginPassword.length >= PASSWORD_LENGHT;
    return verifyEmail && verifyPassword;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await httpRequest.post('/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setRole(data.role);
    } catch (err) {
      setError('Dados inválidos');
    }
  };

  useEffect(() => {
    if (role === 'customer') {
      navigate('/customer/products');
    }
    if (role === 'seller') {
      navigate('/seller');
    }
    if (role === 'administrator') {
      navigate('/admin/manage');
    }
  }, [role]);

  useEffect(() => {
    setIsButtonDisabled(!verifyLogin(email, password));
  }, [email, password]);

  return (
    <div className="LoginPage">
      <img src="" alt="logo" className="AppLogo" />
      <h1>Delivery App</h1>
      <form onSubmit={ handleSubmit }>
        <input
          data-testid="common_login__input-email"
          value={ email }
          placeholder="email"
          onChange={ (event) => setEmail(event.target.value) }
          type="text"
        />
        <input
          data-testid="common_login__input-password"
          placeholder="password"
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          type="password"
        />
        <button
          data-testid="common_login__button-login"
          type="button"
          disabled={ isButtonDisabled }
          onClick={ handleSubmit }
        >
          Login
        </button>
        <button
          type="button"
          data-testid="common_login__button-register"
          onClick={ () => navigate('/register') }
        >
          Ainda não tenho conta
        </button>
      </form>
      <p>zebirita@email.com  $#zebirita#$</p>
      {
        error && <p data-testid="common_login__element-invalid-email">{error}</p>
      }
    </div>
  );
}
