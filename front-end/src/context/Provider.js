import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Context from './context';

function Provider({ children }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const contextValue = useMemo(
    () => ({ email, setEmail, password, setPassword }),
    [email, password],
  );
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
