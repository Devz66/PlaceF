const CONFIG = {
    API_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000'
        : 'https://placeb.onrender.com'
};

console.log('🔌 Login Conectado ao Backend:', CONFIG.API_URL);

export default CONFIG;