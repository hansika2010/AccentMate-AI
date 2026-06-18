# Setup Guide for AccentMate AI

## Initial Setup

### 1. Prerequisites
- Node.js 16+ installed
- Expo CLI: `npm install -g expo-cli`
- Firebase project created at https://firebase.google.com
- OpenAI API key from https://platform.openai.com

### 2. Installation Steps

```bash
# Clone the repository
git clone https://github.com/hansika2010/AccentMate-AI.git
cd AccentMate-AI

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 3. Firebase Setup

1. Create a Firebase project at https://firebase.google.com
2. Enable these services:
   - Authentication (Email/Password)
   - Firestore Database
   - Cloud Storage
3. Copy your config values to `.env.local`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. OpenAI Setup

1. Get your API key from https://platform.openai.com/api-keys
2. Add to `.env.local`:

```
OPENAI_API_KEY=your_openai_api_key
```

### 5. Start Development

```bash
# Start Expo development server
expo start

# For iOS (Mac only)
expo start --ios

# For Android
expo start --android

# For Web
expo start --web
```

## Firebase Security Rules

Add these rules to Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sessions collection
    match /sessions/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }

    // User Progress
    match /userProgress/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }

    // User Stats
    match /userStats/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }

    // Challenges
    match /challenges/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Project Structure

```
AccentMate-AI/
├── src/
│   ├── screens/           # Screen components
│   ├── components/        # Reusable components
│   ├── services/          # Business logic services
│   ├── config/            # Firebase & OpenAI config
│   ├── redux/            # State management
│   ├── navigation/       # Navigation structure
│   └── assets/           # Images and icons
├── App.js               # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── .env.example         # Environment variables template
```

## Troubleshooting

### Audio Recording Not Working
- Ensure microphone permissions are granted
- For iOS, add microphone usage description to info.plist
- For Android, check AndroidManifest.xml permissions

### Firebase Connection Issues
- Verify Firebase config in `.env.local`
- Check Firebase project is active
- Ensure Firestore is enabled

### OpenAI API Errors
- Verify API key is correct
- Check API usage and quota
- Ensure API key has proper permissions

## Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

## Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build
```

## Next Steps

1. Set up authentication screens
2. Implement user profiles
3. Add more speaking modes
4. Enhance pronunciation analysis
5. Add social features
6. Implement analytics

## Support

For issues or questions, please open an issue on GitHub or contact the development team.
