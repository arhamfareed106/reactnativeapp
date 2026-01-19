// Mock authentication actions for frontend demo
export const login = (email, password) => {
  return {
    type: 'LOGIN_SUCCESS',
    payload: {
      user: {
        id: 1,
        name: 'Demo User',
        email: email,
        role: 'worker'
      }
    }
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT'
  };
};

export const register = (userData) => {
  return {
    type: 'REGISTER_SUCCESS',
    payload: {
      user: {
        id: userData.email.split('@')[0],
        name: userData.name,
        email: userData.email,
        role: userData.role
      }
    }
  };
};