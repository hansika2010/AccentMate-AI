# API Integration Guide

## OpenAI Integration

### Speech-to-Text (Whisper API)

The app uses OpenAI's Whisper API for converting speech to text:

```javascript
import openai from '../config/openai';

const transcribe = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
});
```

### Text Analysis

For grammar, fluency, and pronunciation analysis:

```javascript
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    {
      role: 'system',
      content: 'You are an English coaching expert...',
    },
    {
      role: 'user',
      content: 'Analyze this sentence...',
    },
  ],
  temperature: 0.5,
});
```

## Firebase Integration

### Firestore Collections

#### Sessions
```javascript
{
  userId: string,
  transcript: string,
  scores: {
    grammar: number,
    fluency: number,
    vocabulary: number,
    confidence: number,
    accent: number,
  },
  feedback: object,
  createdAt: timestamp,
}
```

#### User Stats
```javascript
{
  userId: string,
  dailyStreak: number,
  totalSessions: number,
  averageScores: object,
  createdAt: timestamp,
  updatedAt: timestamp,
}
```

#### Challenges
```javascript
{
  userId: string,
  weekNumber: number,
  title: string,
  description: string,
  completed: boolean,
  score: number,
  createdAt: timestamp,
}
```

### Cloud Storage

Audio files are stored in Firebase Cloud Storage:

```
gs://your-bucket/recordings/{userId}/{sessionId}.wav
```

## Rate Limiting

### OpenAI Quotas
- GPT-4: Check your API limits
- Whisper: 25MB file size limit
- Rate limits: Check your plan

### Firebase Limits
- Firestore: 1 write/second per document
- Storage: 20GB/day upload
- Auth: 5 requests/second

## Error Handling

All services include error handling:

```javascript
try {
  const result = await audioService.transcribeAudio(uri);
  if (result.success) {
    // Handle success
  } else {
    console.error(result.error);
  }
} catch (error) {
  // Handle unexpected errors
}
```

## Cost Estimation

### OpenAI Costs
- Whisper: $0.006 per minute
- GPT-4: $0.03/1K input tokens, $0.06/1K output tokens

### Firebase Costs
- Firestore: $0.06 per 100K reads
- Storage: $0.18 per GB

## Environment Variables

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
OPENAI_API_KEY=
```

## Debugging

### Enable Logging

```javascript
// In your development code
const DEBUG = __DEV__;

if (DEBUG) {
  console.log('API Call:', endpoint);
  console.log('Response:', response);
}
```

### Firebase Debugging

```bash
# Monitor Firestore in real-time
firebase emulator:start --import=/path/to/backup
```
