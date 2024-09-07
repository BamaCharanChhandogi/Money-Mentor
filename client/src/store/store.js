import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  auth: {
    isAuthenticated: !!token,
    user: user,
    token: token,
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: initialState,
});
