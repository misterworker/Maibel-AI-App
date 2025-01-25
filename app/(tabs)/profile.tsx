import React, { useEffect, useRef  } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { useTheme } from '../../context/ThemeContext';
import { useModal } from '../../context/ModalContext';
import { themeStyles } from '../../context/themeStyles';
import Confetti from '../../components/Confetti';
import { useChallengeData } from '../../hooks/useChallengeData';
import Challenge from '../onboard/onboard_data';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CongratulationModal from '@/components/CongratulationModal';
import { router } from 'expo-router';

function ChallengeCard({ challenge, currentTheme, isCompleted }: { challenge: Challenge, currentTheme: any, isCompleted?: boolean }) {
  const challengeProg = parseFloat(((challenge.progress || 0) * 100).toFixed(2))
  const challengeProgPercent = parseFloat((challenge.progress || 0).toFixed(2))
  return (
    <View
      style={[
        styles.challengeCard,
        { 
          backgroundColor: isCompleted ? currentTheme.successBackground : currentTheme.cardBackground,
          borderColor: isCompleted ? currentTheme.success : 'transparent',
          borderWidth: isCompleted ? 2 : 0,  // Adds a border for completed challenges
          shadowColor: isCompleted ? currentTheme.success : '#000',  // Lighter shadow for completed
          shadowOpacity: isCompleted ? 0.2 : 0.1,
        },
      ]}
    >
      <View style={styles.challengeHeader}>
        <Text style={[styles.challengeTitle, { color: currentTheme.text }]}>
          {challenge.title}
        </Text>

        {/* Add checkmark icon next to the title */}
        {isCompleted && (
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={currentTheme.success}
            style={styles.checkmarkIcon}
          />
        )}
      </View>

      <Text style={[styles.description, { color: currentTheme.subtext }]}>
        {challenge.desc}
      </Text>

      <ProgressBar
        key={challengeProgPercent}
        progress={isCompleted ? 1 : challengeProgPercent}
        color={isCompleted ? currentTheme.success : currentTheme.primary}
        style={styles.progressBar}
      />
      <Text style={[styles.progressText, { color: currentTheme.subtext }]}>
        {isCompleted ? 'Completed' : challengeProg + '% Completed'}
      </Text>
    </View>
  );
}

export default function ProfilePage() {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme];
  const { challenge, isCompleted, completedChallenges, fetchData  } = useChallengeData();
  const { showModal, hideModal, isModalVisible, setModalWithDelay } = useModal();
  const prevIsCompletedRef = useRef(isCompleted);

  useEffect(() => {
    if (isCompleted && !prevIsCompletedRef.current) {
      setModalWithDelay(500);
    }
    prevIsCompletedRef.current = isCompleted;
  }, [isCompleted, setModalWithDelay]);

  const handleModalClose = (onboardDay: string) => {
    hideModal();

    router.push(`../onboard/day${onboardDay}_1`);
  };

  if (!challenge && !completedChallenges) {
    return (
      <View style={styles.container}>
        <Text style={[styles.pageTitle, { color: currentTheme.text }]}>Loading Challenge...</Text>
      </View>
    );
  }

  const defaultChallenge = {
    id: 0,
    title: 'See You Tomorrow!',
    desc: 'Get ready for a new challenge tomorrow.',
    progress: 1, //* TODO Turn into countdown
    type: 'default',
    docId: 'tango'
  };

  // If there is no current challenge, use the default one
  const challengeToShow = challenge || defaultChallenge;

  return (
    <>
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.pageTitle, { color: currentTheme.text }]}>Your Current Challenge</Text>

      {isCompleted && <Confetti />}
      <ChallengeCard challenge={challengeToShow} currentTheme={currentTheme} isCompleted={false} />

      <Text style={[styles.sectionTitle, { color: currentTheme.text, marginBottom: 20 }]}>Completed Challenges</Text>
      {completedChallenges.map((completedChallenge) => (
        <ChallengeCard
          key={completedChallenge.id}
          challenge={completedChallenge}
          currentTheme={currentTheme}
          isCompleted={true}  // Mark completed challenges
        />
      ))}
    </ScrollView>
    <CongratulationModal isVisible={isModalVisible} onClose={handleModalClose} />
    </>
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
  challengeHeader: {
    flexDirection: 'row',  // To align title and icon in a row
    alignItems: 'center',  // Vertically center the title and icon
    justifyContent: 'space-between', // Add space between them
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  checkmarkIcon: {
    marginLeft: 10,
  },
});
