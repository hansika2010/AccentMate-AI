import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isLoggedIn: false,
  dailyStreak: 0,
  totalSessions: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
    updateStreak: (state, action) => {
      state.dailyStreak = action.payload;
    },
    incrementSessions: (state) => {
      state.totalSessions += 1;
    },
  },
});

export const { setUser, logout, updateStreak, incrementSessions } = authSlice.actions;
export default authSlice.reducer;
