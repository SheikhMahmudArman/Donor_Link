const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = `${API_BASE_URL}/api`;

export const endpoints = {
  donors: {
    list: `${API_URL}/donors`,
    stats: `${API_URL}/donors/stats`,
    update: `${API_URL}/donors/status`,
    getById: (id) => `${API_URL}/donors/${id}`
  },
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`
  },
  user: {
    profile: `${API_URL}/user/me`,
    update: `${API_URL}/user/update`
  },
  eligibility: {
    status: `${API_URL}/eligibility/status`,
    save: `${API_URL}/eligibility/save`
  }
};