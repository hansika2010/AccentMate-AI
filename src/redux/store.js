import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import speechReducer from './slices/speechSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    speech: speechReducer,
  },
});
