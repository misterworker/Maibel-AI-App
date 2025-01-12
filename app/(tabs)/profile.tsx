import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { themeStyles } from '../../context/themeStyles';
import Confetti from '../../components/Confetti';
import { useRoute } from '@react-navigation/native';

interface Challenge {
  id: string;
  title: string;
  progress: number; // Progress percentage (0-1)
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Athlete';
}

const challenge: Challenge = {
  id: '1',
  title: '10K Steps Daily',
  progress: 0.7,
  level: 'Intermediate',
};

const ProfilePage: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme];
  const route = useRoute();
  const { isCompleted } = route.params as any || false;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.pageTitle, { color: currentTheme.text }]}>Your Current Challenge</Text>

      {isCompleted && <Confetti />}

      <View style={[styles.challengeCard, { backgroundColor: currentTheme.cardBackground }]}>
        <Text style={[styles.challengeTitle, { color: currentTheme.text }]}>{challenge.title}</Text>
        <Text style={[styles.level, { color: currentTheme.subtext }]}>Level: {challenge.level}</Text>
        <ProgressBar progress={challenge.progress} color={currentTheme.primary} style={styles.progressBar} />
        <Text style={[styles.progressText, { color: currentTheme.subtext }]}>{Math.round(challenge.progress * 100)}% Completed</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  challengeCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  level: {
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  progressText: {
    fontSize: 12,
  },
});

export default ProfilePage;
