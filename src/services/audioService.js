import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import openai from '../config/openai';

class AudioService {
  constructor() {
    this.recording = null;
    this.sound = null;
  }

  async startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await this.recording.startAsync();

      return { success: true };
    } catch (error) {
      console.error('Failed to start recording:', error);
      return { success: false, error: error.message };
    }
  }

  async stopRecording() {
    try {
      if (!this.recording) {
        return { success: false, error: 'No recording in progress' };
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.recording = null;

      return { success: true, uri };
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return { success: false, error: error.message };
    }
  }

  async transcribeAudio(audioUri) {
    try {
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const transcript = await openai.audio.transcriptions.create({
        file: new File([Buffer.from(base64Audio, 'base64')], 'audio.wav', { type: 'audio/wav' }),
        model: 'whisper-1',
      });

      return { success: true, text: transcript.text };
    } catch (error) {
      console.error('Transcription failed:', error);
      return { success: false, error: error.message };
    }
  }

  async playAudio(audioUri) {
    try {
      this.sound = new Audio.Sound();
      await this.sound.loadAsync({ uri: audioUri });
      await this.sound.playAsync();
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }

  async stopPlayback() {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      }
    } catch (error) {
      console.error('Failed to stop playback:', error);
    }
  }
}

export default new AudioService();
