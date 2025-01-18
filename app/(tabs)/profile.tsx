import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { themeStyles } from '../../context/themeStyles';
import Confetti from '../../components/Confetti';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { challenges } from '../onboard/onboard_data';
import { getOnboardDay, getIsCompleted, getRecommendation, getChallengeProgress } from '../../utils/getFromStorage';

interface Challenge {
  id: string;
  title: string;
  progress: number;
  description: string;
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme];
  const route = useRoute();
  const { isCompleted: initialCompleted } = route.params as any || { isCompleted: false };

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const fetchData = useCallback(async () => {
    const recommendation = await getRecommendation();
    const onboardDay = await getOnboardDay();
    const completed = await getIsCompleted();
    let challengeProgress = await getChallengeProgress() as any;
    challengeProgress = Number(challengeProgress);

 
    console.log("Current Challenge Progress", challengeProgress)
    console.log("Current Challenge: ", challenge)

    setIsCompleted(completed);

    const currentChallenge = challenges.find((ch) => ch.id.trim() === onboardDay.trim());
      if (currentChallenge) {

        const description = typeof currentChallenge.desc === 'string'
          ? currentChallenge.desc
          : currentChallenge.desc(recommendation);
        setChallenge({
          id: currentChallenge.id,
          title: currentChallenge.title,
          progress: challengeProgress,
          description: description,
        });
      }
      console.log("New Challenge: ", challenge)
  }, []);



  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={[styles.pageTitle, { color: currentTheme.text }]}>Loading Challenge...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.pageTitle, { color: currentTheme.text }]}>Your Current Challenge</Text>

      {isCompleted && <Confetti />}

      <View style={[styles.challengeCard, { backgroundColor: currentTheme.cardBackground }]}>
        <Text style={[styles.challengeTitle, { color: currentTheme.text }]}>{challenge.title}</Text>
        <Text style={[styles.description, { color: currentTheme.subtext }]}>Description: {challenge.description}</Text>
        <ProgressBar key={challenge.progress} progress={challenge.progress} color={currentTheme.primary} style={styles.progressBar} />
        <Text style={[styles.progressText, { color: currentTheme.subtext }]}>
          {Math.round(challenge.progress * 100)}% Completed
        </Text>
      </View>
    </ScrollView>
  );
}

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
  description: {
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
