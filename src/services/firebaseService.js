import { db } from '../config/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

class FirebaseService {
  async saveSpeakingSession(userId, sessionData) {
    try {
      const docRef = await addDoc(collection(db, 'sessions'), {
        userId,
        ...sessionData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, sessionId: docRef.id };
    } catch (error) {
      console.error('Failed to save session:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserSessions(userId) {
    try {
      const q = query(collection(db, 'sessions'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, sessions };
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return { success: false, error: error.message };
    }
  }

  async saveUserProgress(userId, progressData) {
    try {
      const docRef = await addDoc(collection(db, 'userProgress'), {
        userId,
        ...progressData,
        createdAt: serverTimestamp(),
      });
      return { success: true, progressId: docRef.id };
    } catch (error) {
      console.error('Failed to save progress:', error);
      return { success: false, error: error.message };
    }
  }

  async updateUserStats(userId, stats) {
    try {
      const q = query(
        collection(db, 'userStats'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(collection(db, 'userStats'), {
          userId,
          ...stats,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          ...stats,
          updatedAt: serverTimestamp(),
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to update stats:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserStats(userId) {
    try {
      const q = query(
        collection(db, 'userStats'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          success: true,
          stats: {
            dailyStreak: 0,
            totalSessions: 0,
            averageScores: {
              grammar: 0,
              fluency: 0,
              vocabulary: 0,
              confidence: 0,
              accent: 0,
            },
          },
        };
      }

      return { success: true, stats: querySnapshot.docs[0].data() };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return { success: false, error: error.message };
    }
  }

  async saveChallengeProgress(userId, challengeData) {
    try {
      const docRef = await addDoc(collection(db, 'challenges'), {
        userId,
        ...challengeData,
        createdAt: serverTimestamp(),
      });
      return { success: true, challengeId: docRef.id };
    } catch (error) {
      console.error('Failed to save challenge progress:', error);
      return { success: false, error: error.message };
    }
  }

  async getWeeklyChallenges(userId) {
    try {
      const q = query(
        collection(db, 'challenges'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const challenges = [];
      querySnapshot.forEach((doc) => {
        challenges.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, challenges };
    } catch (error) {
      console.error('Failed to get challenges:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new FirebaseService();
