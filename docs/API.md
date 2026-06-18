# API Documentation

## Overview
AccentMate AI uses OpenAI APIs for speech processing and Firebase for data storage. This document describes the key API integrations.

## OpenAI APIs

### Whisper API (Speech-to-Text)
Converts user audio recordings to text.

**Endpoint:** `POST /v1/audio/transcriptions`

**Parameters:**
- `file`: Audio file (WAV, MP3, M4A, FLAC)
- `model`: "whisper-1"
- `language`: "en" (optional)

**Response:**
```json
{
  "text": "The user's transcribed speech"
}
```

**Usage in Code:**
```javascript
const transcript = await audioService.transcribeAudio(audioUri);
```

### GPT-4 API (Text Analysis)
Analyzes transcribed text for grammar, fluency, and pronunciation.

**Endpoint:** `POST /v1/chat/completions`

**Request:**
```json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "You are an English grammar expert..."
    },
    {
      "role": "user",
      "content": "Analyze this sentence for grammar: \"...\""
    }
  ],
  "temperature": 0.5
}
```

**Response:**
```json
{
  "choices": [
    {
      "message": {
        "content": "{\"mistakes\": [], \"score\": 85, ...}"
      }
    }
  ]
}
```

## Firebase APIs

### Authentication
User registration and login.

**Methods:**
- `auth.createUserWithEmailAndPassword(email, password)`
- `auth.signInWithEmailAndPassword(email, password)`
- `auth.signOut()`

### Firestore Database

#### Collections

##### `users`
Stores user profile information.

**Schema:**
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "createdAt": "timestamp",
  "dailyStreak": "number",
  "lastPracticeDate": "timestamp"
}
```

##### `sessions`
Stores each speaking practice session.

**Schema:**
```json
{
  "userId": "string",
  "topic": "string",
  "transcript": "string",
  "scores": {
    "grammar": "number",
    "fluency": "number",
    "vocabulary": "number",
    "confidence": "number",
    "accent": "number"
  },
  "feedback": "object",
  "createdAt": "timestamp"
}
```

##### `userProgress`
Tracks user improvement over time.

**Schema:**
```json
{
  "userId": "string",
  "date": "timestamp",
  "sessionsCompleted": "number",
  "averageGrammarScore": "number",
  "averageFluencyScore": "number",
  "streak": "number"
}
```

##### `challenges`
Stores weekly challenge progress.

**Schema:**
```json
{
  "userId": "string",
  "week": "number",
  "challenge": "string",
  "completed": "boolean",
  "score": "number",
  "createdAt": "timestamp"
}
```

### Firestore Operations

#### Create a Session
```javascript
const result = await firebaseService.saveSpeakingSession(userId, {
  topic: "Future Goals",
  transcript: "I want to...",
  scores: { grammar: 85, fluency: 78, ... },
  feedback: { ... }
});
```

#### Get User Sessions
```javascript
const result = await firebaseService.getUserSessions(userId);
```

#### Update User Stats
```javascript
const result = await firebaseService.updateUserStats(userId, {
  dailyStreak: 5,
  totalSessions: 45
});
```

## Service Layer

### AudioService
Handles audio recording, playback, and transcription.

**Methods:**
- `startRecording()` - Start recording audio
- `stopRecording()` - Stop recording and return file URI
- `transcribeAudio(uri)` - Convert audio to text
- `playAudio(uri)` - Play back audio file

**Example:**
```javascript
const result = await audioService.startRecording();
// User speaks...
const { uri } = await audioService.stopRecording();
const { text } = await audioService.transcribeAudio(uri);
```

### FeedbackService
Analyzes speech and provides comprehensive feedback.

**Methods:**
- `analyzeGrammar(transcript)` - Analyze grammar
- `analyzeAmerican(transcript)` - Provide native American version
- `analyzePronunciation(transcript)` - Analyze pronunciation
- `analyzeComprehensive(transcript)` - Get all feedback at once

**Example:**
```javascript
const feedback = await feedbackService.analyzeComprehensive(transcript);
```

**Returns:**
```json
{
  "original_transcript": "string",
  "grammar": { "mistakes": [], "score": 85, "corrected_text": "" },
  "american": { "native_version": "", "explanation": "" },
  "pronunciation": { "issues": [], "accent_score": 80 },
  "scores": {
    "grammar": 85,
    "fluency": 78,
    "vocabulary": 82,
    "confidence": 75,
    "accent": 80
  }
}
```

### TopicService
Manages speaking topics and conversation prompts.

**Methods:**
- `getRandomTopic()` - Get a random topic
- `generatePrompts(topic)` - Generate speaking prompts for a topic
- `generateWeeklyChallenge(week)` - Get weekly challenge
- `startConversation(topic)` - Start AI conversation
- `continueConversation(messages)` - Continue conversation

**Example:**
```javascript
const prompts = await topicService.generatePrompts("Technology");
```

### FirebaseService
Manages all database operations.

**Methods:**
- `saveSpeakingSession(userId, data)` - Save session
- `getUserSessions(userId)` - Retrieve sessions
- `saveUserProgress(userId, data)` - Save progress
- `updateUserStats(userId, stats)` - Update stats
- `getUserStats(userId)` - Get user stats
- `saveChallengeProgress(userId, data)` - Save challenge
- `getWeeklyChallenges(userId)` - Get challenges

## Redux State Management

### Auth Slice
```javascript
{
  user: null | { uid, email, displayName },
  isLoggedIn: false,
  dailyStreak: 0,
  totalSessions: 0
}
```

**Actions:**
- `setUser(user)` - Set current user
- `logout()` - Clear user data
- `updateStreak(streak)` - Update daily streak
- `incrementSessions()` - Increment total sessions

### Speech Slice
```javascript
{
  transcript: "",
  feedback: null,
  scores: { grammar: 0, fluency: 0, ... },
  sessionHistory: [],
  isRecording: false
}
```

**Actions:**
- `startRecording()` - Start recording
- `stopRecording()` - Stop recording
- `setTranscript(text)` - Set transcript
- `setScores(scores)` - Set scores
- `setFeedback(feedback)` - Set feedback
- `addSessionToHistory(session)` - Add to history
- `resetSession()` - Clear session data

## Error Handling

All services return consistent response objects:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

### OpenAI
- Whisper: 60 requests per minute
- GPT-4: 500 requests per hour (based on plan)

### Firebase
- Firestore: 10,000 reads, 10,000 writes per day (free tier)

## Environment Variables Required

```
OPENAI_API_KEY=sk-...
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Best Practices

1. **Error Handling**: Always check `success` flag before accessing data
2. **Rate Limiting**: Implement exponential backoff for retries
3. **Caching**: Cache feedback for 24 hours to reduce API calls
4. **Async/Await**: Use proper async/await patterns
5. **Validation**: Validate input data before API calls
6. **Logging**: Log all API calls for debugging

## Monitoring & Logging

Enable logging in development:
```javascript
process.env.DEBUG = 'accentmate:*'
```

---

Last Updated: June 2024
Version: 1.0.0
