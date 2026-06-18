import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

export default function FeedbackScreen({ route }) {
  const { feedback } = route.params || {};
  const [expandedSection, setExpandedSection] = useState('scores');

  if (!feedback) {
    return (
      <View style={styles.container}>
        <Text>No feedback available</Text>
      </View>
    );
  }

  const { scores, grammar, american, pronunciation, original_transcript } = feedback;

  const renderScoreCard = (title, score, color) => (
    <View style={styles.scoreCard}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreTitle}>{title}</Text>
        <Text style={[styles.scoreValue, { color }]}>{score}</Text>
      </View>
      <ProgressBar
        progress={score / 100}
        color={color}
        style={styles.progressBar}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Scores Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>📊 Your Scores</Text>
          {renderScoreCard('Grammar', scores.grammar, '#FF6B6B')}
          {renderScoreCard('Fluency', scores.fluency, '#4ECDC4')}
          {renderScoreCard('Vocabulary', scores.vocabulary, '#45B7D1')}
          {renderScoreCard('Confidence', scores.confidence, '#FFA07A')}
          {renderScoreCard('Accent', scores.accent, '#98D8C8')}
        </Card.Content>
      </Card>

      {/* Original Transcript */}
      <Card style={styles.card}>
        <Card.Content>
          <TouchableOpacity
            onPress={() =>
              setExpandedSection(
                expandedSection === 'original' ? null : 'original'
              )
            }
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🎤 Your Original Transcript</Text>
              <MaterialCommunityIcons
                name={expandedSection === 'original' ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
          {expandedSection === 'original' && (
            <Text style={styles.transcript}>{original_transcript}</Text>
          )}
        </Card.Content>
      </Card>

      {/* Corrected Transcript */}
      {grammar?.corrected_text && (
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              onPress={() =>
                setExpandedSection(
                  expandedSection === 'corrected' ? null : 'corrected'
                )
              }
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>✅ Corrected Version</Text>
                <MaterialCommunityIcons
                  name={expandedSection === 'corrected' ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
            {expandedSection === 'corrected' && (
              <Text style={styles.transcript}>{grammar.corrected_text}</Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Grammar Mistakes */}
      {grammar?.mistakes?.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              onPress={() =>
                setExpandedSection(
                  expandedSection === 'grammar' ? null : 'grammar'
                )
              }
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>📝 Grammar Mistakes</Text>
                <MaterialCommunityIcons
                  name={expandedSection === 'grammar' ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
            {expandedSection === 'grammar' && (
              <View>
                {grammar.mistakes.map((mistake, idx) => (
                  <View key={idx} style={styles.mistakeItem}>
                    <Text style={styles.mistakeLabel}>Mistake:</Text>
                    <Text style={styles.mistakeText}>{mistake.original}</Text>
                    <Text style={styles.mistakeLabel}>Correction:</Text>
                    <Text style={styles.correctionText}>{mistake.correction}</Text>
                    <Text style={styles.explanationText}>
                      💡 {mistake.explanation}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Native American Version */}
      {american?.native_version && (
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              onPress={() =>
                setExpandedSection(
                  expandedSection === 'native' ? null : 'native'
                )
              }
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🇺🇸 Native American Version</Text>
                <MaterialCommunityIcons
                  name={expandedSection === 'native' ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
            {expandedSection === 'native' && (
              <>
                <Text style={styles.nativeText}>{american.native_version}</Text>
                <Text style={styles.explanationText}>
                  💡 Why it sounds more natural:
                </Text>
                <Text style={styles.explanationText}>{american.explanation}</Text>
              </>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Pronunciation Feedback */}
      {pronunciation?.pronunciation_issues?.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <TouchableOpacity
              onPress={() =>
                setExpandedSection(
                  expandedSection === 'pronunciation' ? null : 'pronunciation'
                )
              }
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🔊 Pronunciation Feedback</Text>
                <MaterialCommunityIcons
                  name={expandedSection === 'pronunciation' ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#fff"
                />
              </View>
            </TouchableOpacity>
            {expandedSection === 'pronunciation' && (
              <View>
                {pronunciation.pronunciation_issues.map((issue, idx) => (
                  <View key={idx} style={styles.issueItem}>
                    <Text style={styles.wordText}>{issue.word}</Text>
                    <Text style={styles.explanationText}>Issue: {issue.issue}</Text>
                    <Text style={styles.phoneticsText}>
                      📢 {issue.phonetic}
                    </Text>
                  </View>
                ))}
                {pronunciation.focus_areas?.length > 0 && (
                  <>
                    <Text style={styles.focusAreasTitle}>Focus Areas:</Text>
                    {pronunciation.focus_areas.map((area, idx) => (
                      <Text key={idx} style={styles.focusArea}>
                        • {area}
                      </Text>
                    ))}
                  </>
                )}
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      <Button
        mode="contained"
        onPress={() => {
          // Navigate back or start new session
        }}
        style={styles.button}
      >
        Start New Session
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  card: {
    backgroundColor: '#2a2a2a',
    marginVertical: 10,
    borderRadius: 12,
    borderColor: '#404040',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreCard: {
    marginVertical: 8,
    paddingVertical: 12,
    borderBottomColor: '#404040',
    borderBottomWidth: 1,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 14,
    color: '#b0b0b0',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  transcript: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
    marginTop: 12,
  },
  nativeText: {
    fontSize: 14,
    color: '#4ECDC4',
    lineHeight: 22,
    marginTop: 12,
    fontStyle: 'italic',
  },
  mistakeItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftColor: '#FF6B6B',
    borderLeftWidth: 3,
  },
  mistakeLabel: {
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginTop: 4,
  },
  mistakeText: {
    fontSize: 13,
    color: '#e0e0e0',
    marginTop: 2,
    textDecorationLine: 'line-through',
  },
  correctionText: {
    fontSize: 13,
    color: '#4ECDC4',
    marginTop: 2,
    fontWeight: '600',
  },
  explanationText: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 6,
    lineHeight: 18,
  },
  issueItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftColor: '#FFA07A',
    borderLeftWidth: 3,
  },
  wordText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFA07A',
  },
  phoneticsText: {
    fontSize: 12,
    color: '#b0b0b0',
    marginTop: 6,
  },
  focusAreasTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#98D8C8',
    marginTop: 12,
  },
  focusArea: {
    fontSize: 12,
    color: '#b0b0b0',
    marginVertical: 4,
  },
  button: {
    marginVertical: 20,
    paddingVertical: 8,
    backgroundColor: '#FF6B6B',
  },
});
