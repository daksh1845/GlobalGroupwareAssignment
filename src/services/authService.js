import axios from 'axios';

const API_URL = 'https://reqres.in/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data.token;
  } catch (error) {
    throw error.response?.data?.error || 'Login failed';
  }
};

export const getUsers = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/users?page=${page}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch users';
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update user';
  }
};

export const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
    return true;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete user';
  }
}; 