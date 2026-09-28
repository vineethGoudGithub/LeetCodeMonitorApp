import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tpo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Unable to connect to the server. Please make sure the Spring Boot backend is running.';
    if (error.response) {
      if (error.response.data && error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.status === 401) {
        message = 'Invalid credentials. Please verify your email and password.';
      } else if (error.response.status === 404) {
        message = 'Requested resource not found.';
      } else if (error.response.status === 500) {
        message = 'An unexpected server error occurred. Please try again.';
      }
    } else if (error.request) {
      message = 'Unable to connect to the server. Please check your network and ensure Spring Boot is running on port 8080.';
    }
    
    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
};

export const studentApi = {
  getStudents: (params) => api.get('/students', { params }),
  getAllStudents: (params) => api.get('/students/all', { params }),
  getStudentById: (id) => api.get(`/students/${id}`),
  createStudent: (studentData) => api.post('/students', studentData),
  updateStudent: (id, studentData) => api.put(`/students/${id}`, studentData),
  deleteStudent: (id) => api.delete(`/students/${id}`),
  searchStudents: (keyword) => api.get('/students/search', { params: { keyword } }),
  getStudentsByYear: (year) => api.get(`/students/year/${encodeURIComponent(year)}`),
  getStatistics: () => api.get('/students/statistics'),
  getRecentStudents: () => api.get('/students/recent'),
  getFilterOptions: () => api.get('/students/filters'),
};

export default api;
