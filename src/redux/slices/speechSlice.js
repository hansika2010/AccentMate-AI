import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSession: null,
  transcript: '',
  feedback: null,
  isRecording: false,
  scores: {
    grammar: 0,
    fluency: 0,
    vocabulary: 0,
    confidence: 0,
    accent: 0,
  },
  corrections: [],
  nativeVersion: '',
  sessionHistory: [],
};

const speechSlice = createSlice({
  name: 'speech',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.transcript = '';
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    setTranscript: (state, action) => {
      state.transcript = action.payload;
    },
    setScores: (state, action) => {
      state.scores = action.payload;
    },
    setFeedback: (state, action) => {
      state.feedback = action.payload;
    },
    setCorrections: (state, action) => {
      state.corrections = action.payload;
    },
    setNativeVersion: (state, action) => {
      state.nativeVersion = action.payload;
    },
    addSessionToHistory: (state, action) => {
      state.sessionHistory.push(action.payload);
    },
    resetSession: (state) => {
      state.currentSession = null;
      state.transcript = '';
      state.feedback = null;
      state.scores = initialState.scores;
      state.corrections = [];
      state.nativeVersion = '';
    },
  },
});

export const {
  startRecording,
  stopRecording,
  setTranscript,
  setScores,
  setFeedback,
  setCorrections,
  setNativeVersion,
  addSessionToHistory,
  resetSession,
} = speechSlice.actions;

export default speechSlice.reducer;
