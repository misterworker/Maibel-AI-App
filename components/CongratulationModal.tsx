import React, { useState } from 'react';
import { Modal, Text, Button, View, StyleSheet, ActivityIndicator } from 'react-native';
import { getOnboardDay } from '@/utils/getFromStorage';
import { setOnboardDay, setIsCompleted, setChallengeProgress, setRecomendationVal, setRecomendationUnit } from '@/utils/saveToSecureStorage';
import { recommendationResponse } from '../utils/botApi';
import Challenge, { challenges } from '../app/onboard/onboard_data';

interface CongratulationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CongratulationModal: React.FC<CongratulationModalProps> = ({ isVisible, onClose }) => {
  const [loading, setLoading] = useState(false);

  const resetChallenge = async () => {
    setLoading(true);

    try {
      const onboardDay = await getOnboardDay();
      const currentChallenge = challenges.find((ch) => ch.id === onboardDay + 1) || { id: 0, type: "none", title: "none", desc: "none", qns: 0};
      const challengeResponse = await recommendationResponse(currentChallenge.desc);

      if (challengeResponse.recommendation && challengeResponse.unit) {
        await setRecomendationVal(challengeResponse.recommendation)
        await setRecomendationUnit(challengeResponse.unit)
      }

      // Reset challenge state
      await setIsCompleted(false);
      await setOnboardDay(onboardDay + 1);
      await setChallengeProgress("0");
    } catch (error) {
      console.error("Error resetting challenge or saving recommendation:", error);
    } finally {
      setLoading(false); // Hide the loading indicator
      onClose();
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {loading ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>Loading...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Congratulations!</Text>
              <Text style={styles.message}>You've completed the challenge!</Text>
              <Button title="Awesome" onPress={resetChallenge} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  loadingOverlay: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CongratulationModal;
