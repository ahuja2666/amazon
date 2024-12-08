import axios from 'axios';

// Amazon Selling Partner API Credentials
const BASE_URL = 'https://sellingpartnerapi-na.amazon.com';
const REFRESH_URL = 'https://api.amazon.com/auth/o2/token';



// Tokens and expiry tracking
let tokens = {
  accessToken: localStorage.getItem('accessToken'), // Get access token from localStorage
  refreshToken: REFRESH_TOKEN,
  expiryTime: localStorage.getItem('expiryTime'), // Get expiry time from localStorage
};

// Axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    console.log('Refreshing access token...');
    const response = await axios.post(
      REFRESH_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    // Update tokens and expiry time
    tokens.accessToken = response.data.access_token;
    tokens.expiryTime = Date.now() + 3600 * 1000; // Convert seconds to ms

    // Save to localStorage for persistence
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('expiryTime', tokens.expiryTime);

    console.log('Access token refreshed successfully:', tokens.accessToken);
  } catch (error) {
    console.error('Failed to refresh access token:', error.message);
    throw error;
  }
};

// Request interceptor: Attach access token
apiClient.interceptors.request.use(async (config) => {
  // Check if the token is expired or missing
  if (!tokens.accessToken || Date.now() >= tokens.expiryTime) {
    await refreshAccessToken();
  }
  // Attach the valid access token
  config.headers['x-amz-access-token'] = tokens.accessToken;
  return config;
});

// Response interceptor: Retry on 401
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log('Access token expired, retrying with new token...');
      await refreshAccessToken();
      error.config.headers['x-amz-access-token'] = tokens.accessToken;
      return apiClient.request(error.config); // Retry the original request
    }
    return Promise.reject(error);
  }
);

export default apiClient;
