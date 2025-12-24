import CONFIG from '../config';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders()
      });
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
        throw new Error('API Error');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
  
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${CONFIG.API_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      if (!response.ok) {
         if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login.html';
        }
        throw new Error('API Error');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};
