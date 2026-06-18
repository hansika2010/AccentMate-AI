import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const windowWidth = Dimensions.get('window').width;

const chartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      data: [65, 72, 78, 85],
      color: () => '#FF6B6B',
      strokeWidth: 2,
    },
    {
      data: [60, 68, 75, 82],
      color: () => '#4ECDC4',
      strokeWidth: 2,
    },
  ],
};

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    dailyStreak: 12,
    totalSessions: 45,
    averageScores: {
      grammar: 78,
      fluency: 75,
      vocabulary: 82,
      confidence: 70,
      accent: 72,
    },
    thisWeek: 8,
    thisMonth: 35,
  });

  const renderStatCard = (icon, label, value, color) => (
    <View style={styles.statCard}>
      <Text style={{ fontSize: 28 }}>{icon}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome back! 👋</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* Daily Streak & Stats */}
      <View style={styles.statsContainer}>
        {renderStatCard('🔥', 'Daily Streak', `${stats.dailyStreak} days`, '#FF6B6B')}
        {renderStatCard('🎯', 'Total Sessions', stats.totalSessions, '#4ECDC4')}
        {renderStatCard('⏰', 'This Week', stats.thisWeek, '#45B7D1')}
        {renderStatCard('📊', 'This Month', stats.thisMonth, '#FFA07A')}
      </View>

      {/* Average Scores */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📈 Average Scores</Text>
          <View style={styles.scoresGrid}>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Grammar</Text>
              <Text style={styles.scoreValue}>{stats.averageScores.grammar}</Text>
              <ProgressBar
                progress={stats.averageScores.grammar / 100}
                color="#FF6B6B"
                style={styles.miniProgressBar}
              />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Fluency</Text>
              <Text style={styles.scoreValue}>{stats.averageScores.fluency}</Text>
              <ProgressBar
                progress={stats.averageScores.fluency / 100}
                color="#4ECDC4"
                style={styles.miniProgressBar}
              />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Vocabulary</Text>
              <Text style={styles.scoreValue}>{stats.averageScores.vocabulary}</Text>
              <ProgressBar
                progress={stats.averageScores.vocabulary / 100}
                color="#45B7D1"
                style={styles.miniProgressBar}
              />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Confidence</Text>
              <Text style={styles.scoreValue}>{stats.averageScores.confidence}</Text>
              <ProgressBar
                progress={stats.averageScores.confidence / 100}
                color="#FFA07A"
                style={styles.miniProgressBar}
              />
            </View>
            <View style={styles.scoreItem}>
              <Text style={styles.scoreLabel}>Accent</Text>
              <Text style={styles.scoreValue}>{stats.averageScores.accent}</Text>
              <ProgressBar
                progress={stats.averageScores.accent / 100}
                color="#98D8C8"
                style={styles.miniProgressBar}
              />
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Weekly Progress Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📊 Weekly Progress</Text>
          <LineChart
            data={chartData}
            width={windowWidth - 48}
            height={220}
            chartConfig={{
              backgroundColor: '#2a2a2a',
              backgroundGradientFrom: '#2a2a2a',
              backgroundGradientTo: '#2a2a2a',
              color: () => '#404040',
              labelColor: () => '#b0b0b0',
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#FF6B6B',
              },
            }}
            bezier
            style={{
              marginVertical: 10,
              borderRadius: 16,
            }}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>Grammar</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
              <Text style={styles.legendText}>Fluency</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>🚀 Quick Actions</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('VoicePractice')}
            style={styles.actionButton}
          >
            Start Speaking Practice
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Topics')}
            style={styles.actionButton}
          >
            Choose a Topic
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('WeeklyChallenge')}
            style={styles.actionButton}
          >
            View Weekly Challenge
          </Button>
        </Card.Content>
      </Card>

      {/* Recent Sessions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📝 Recent Sessions</Text>
          <View style={styles.sessionItem}>
            <Text style={styles.sessionTime}>Today, 2:30 PM</Text>
            <Text style={styles.sessionTopic}>Talking about favorite movie</Text>
            <View style={styles.sessionScores}>
              <Text style={styles.sessionScore}>Grammar: 82</Text>
              <Text style={styles.sessionScore}>Fluency: 78</Text>
            </View>
          </View>
          <View style={[styles.sessionItem, { borderTopColor: '#404040', borderTopWidth: 1, paddingTop: 12, marginTop: 12 }]}>
            <Text style={styles.sessionTime}>Yesterday, 4:15 PM</Text>
            <Text style={styles.sessionTopic}>Technology and education discussion</Text>
            <View style={styles.sessionScores}>
              <Text style={styles.sessionScore}>Grammar: 75</Text>
              <Text style={styles.sessionScore}>Fluency: 72</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.footer} />
    </ScrollView>
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
    paddingBottom: 15,
    backgroundColor: '#2a2a2a',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 13,
    color: '#b0b0b0',
    marginTop: 4,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    borderColor: '#404040',
    borderWidth: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderColor: '#404040',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scoreItem: {
    width: '48%',
    marginVertical: 8,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#b0b0b0',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  miniProgressBar: {
    height: 6,
    marginTop: 4,
    borderRadius: 3,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#b0b0b0',
  },
  actionButton: {
    marginVertical: 6,
    backgroundColor: '#FF6B6B',
  },
  sessionItem: {
    paddingVertical: 10,
  },
  sessionTime: {
    fontSize: 12,
    color: '#808080',
  },
  sessionTopic: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 4,
  },
  sessionScores: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 12,
  },
  sessionScore: {
    fontSize: 12,
    color: '#b0b0b0',
  },
  footer: {
    height: 20,
  },
});
