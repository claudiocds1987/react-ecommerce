import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import { authApi } from '@/features/auth/slices/authApi';

export const rootReducer = combineReducers({
  // Reducers will be registered here (e.g. auth, cart, products)
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});
