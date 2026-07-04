const axios = require('axios');
const { backendUrl } = require('../config/config');

const apiClient = axios.create({
  baseURL: backendUrl,
  timeout: 5000,
});

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return { data: response.data, error: null };
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      return { data: null, error: 'The IoT Gateway (Backend) is currently offline or unreachable.' };
    }
    return { data: null, error: error.response?.data?.error || 'An error occurred while fetching data.' };
  }
};

module.exports = {
  getStatus: () => handleRequest(() => apiClient.get('/api/status')),
  getDevices: () => handleRequest(() => apiClient.get('/api/devices')),
  getAlerts: () => handleRequest(() => apiClient.get('/api/alerts')),
  getUsage: () => handleRequest(() => apiClient.get('/api/usage')),
  getRooms: () => handleRequest(() => apiClient.get('/api/rooms')),
};
