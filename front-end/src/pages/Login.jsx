import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import httpRequest from '../axios/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
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
      console.log(data);
      localStorage.setItem('user', JSON.stringify(data));
      if (data.role === 'customer') {
        navigate('/customer/products');
      }
      navigate('/customer/products');
    } catch (err) {
      console.log(err.response.data.message);
      if (err) setError('Dados inválidos');
    }
  };

  // const handleNavigate = () => {
  //   const user = localStorage.getItem('user');
  //   const { role } = user;
  //   if (role === 'customer') {
  //     navigate('/customer/products');
  //   }
  // };

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
          onChange={ (event) => setEmail(event.target.value) }
          type="text"
        />
        <input
          data-testid="common_login__input-password"
          value={ password }
          onChange={ (event) => setPassword(event.target.value) }
          type="password"
        />
        <button
          data-testid="common_login__button-login"
          type="submit"
          disabled={ isButtonDisabled }
        >
          Login
        </button>
      </form>
      <button
        type="button"
        data-testid="common_login__button-register"
        onClick={ () => navigate('/register') }
      >
        Ainda não tenho conta
      </button>

      {error && <p data-testid="common_login__element-invalid-email">{error}</p>}
    </div>
  );
}
