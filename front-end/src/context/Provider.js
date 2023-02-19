import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Context from './context';

function Provider({ children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cartValue, setCartValue] = useState();
  const contextValue = useMemo(
    () => ({ email, setEmail, password, setPassword, cartValue, setCartValue }),
    [email, password, cartValue],
  );

  const loadLocalStorage = () => {
    if (JSON.parse(localStorage.getItem('cartItems'))) {
      const cart = JSON.parse(localStorage.getItem('cartItems'));
      const total = cart.reduce((acc, item) => item.price * item.qty + acc, 0);
      setCartValue(total);
    } else {
      setCartValue(0);
    }
  };

  useEffect(() => {
    loadLocalStorage();
  }, []);

  return (
    <Context.Provider value={ contextValue }>
      { children }
    </Context.Provider>
  );
}

// Provider.propTypes = {
//   children: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
// };
Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Provider;
