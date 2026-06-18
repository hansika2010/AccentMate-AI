import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import audioService from '../services/audioService';
import feedbackService from '../services/feedbackService';

const windowWidth = Dimensions.get('window').width;

export default function VoicePracticeScreen({ navigation }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerInterval = useRef(null);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordingTime(0);
    const result = await audioService.startRecording();

    if (result.success) {
      timerInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setIsRecording(false);
      alert('Failed to start recording: ' + result.error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }

    setIsLoading(true);
    const result = await audioService.stopRecording();

    if (result.success) {
      // Transcribe audio
      const transcriptResult = await audioService.transcribeAudio(result.uri);

      if (transcriptResult.success) {
        // Analyze feedback
        const feedback = await feedbackService.analyzeComprehensive(
          transcriptResult.text
        );

        setIsLoading(false);
        navigation.navigate('Feedback', { feedback });
      } else {
        setIsLoading(false);
        alert('Failed to transcribe audio: ' + transcriptResult.error);
      }
    } else {
      setIsLoading(false);
      alert('Failed to stop recording: ' + result.error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎤 Voice Practice</Text>
        <Text style={styles.subtitle}>Speak naturally and let AI coach you</Text>
      </View>

      <View style={styles.content}>
        {/* Recording Timer */}
        <Text style={styles.timer}>{formatTime(recordingTime)}</Text>

        {/* Microphone Button */}
        <TouchableOpacity
          style={[
            styles.micButton,
            isRecording && styles.micButtonActive,
          ]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <MaterialCommunityIcons
              name={isRecording ? 'stop' : 'microphone'}
              size={60}
              color="#fff"
            />
          )}
        </TouchableOpacity>

        {/* Status Text */}
        <Text style={styles.statusText}>
          {isLoading
            ? '⏳ Analyzing your speech...'
            : isRecording
            ? '🔴 Recording... Tap to stop'
            : '👆 Tap microphone to start'}
        </Text>

        {/* Instructions */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>💡 Tips:</Text>
          <Text style={styles.instructionText}>
            • Speak naturally and clearly
          </Text>
          <Text style={styles.instructionText}>
            • Take your time, no rush
          </Text>
          <Text style={styles.instructionText}>
            • Use complete sentences
          </Text>
          <Text style={styles.instructionText}>
            • Minimum 10 seconds to analyze
          </Text>
        </View>
      </View>

      {/* Quick Options */}
      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Topics')}
          style={styles.footerButton}
        >
          Topics
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Accent')}
          style={styles.footerButton}
        >
          Accent Training
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#b0b0b0',
    marginTop: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 40,
    fontFamily: 'monospace',
  },
  micButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonActive: {
    backgroundColor: '#FF4444',
    shadowOpacity: 0.5,
  },
  statusText: {
    fontSize: 16,
    color: '#b0b0b0',
    marginTop: 20,
    textAlign: 'center',
  },
  instructionsBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginTop: 30,
    width: '100%',
    borderColor: '#404040',
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    color: '#b0b0b0',
    marginVertical: 4,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2a2a2a',
    borderTopColor: '#404040',
    borderTopWidth: 1,
    gap: 10,
  },
  footerButton: {
    flex: 1,
    borderColor: '#FF6B6B',
  },
});
