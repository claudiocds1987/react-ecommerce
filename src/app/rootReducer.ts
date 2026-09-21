import { combineReducers } from '@reduxjs/toolkit';
import { authReducer, authApi } from '@/features/auth';


export const rootReducer = combineReducers({
  // Reducers will be registered here (e.g. auth, cart, products)
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});
