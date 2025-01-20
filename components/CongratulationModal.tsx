import { getOnboardDay } from '@/utils/getFromStorage';
import { setOnboardDay, setIsCompleted, setChallengeProgress } from '@/utils/saveToSecureStorage';
import React from 'react';
import { Modal, Text, Button, View, StyleSheet } from 'react-native';

interface CongratulationModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const CongratulationModal: React.FC<CongratulationModalProps> = ({ isVisible, onClose }) => {
  const resetChallenge = async () => {
    const onboardDay = await getOnboardDay();
    await setIsCompleted(false);
    await setOnboardDay(onboardDay + 1);
    await setChallengeProgress("0")
    onClose();
  }
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.message}>You've completed the challenge!</Text>
          <Button title="Awesome" onPress={resetChallenge} />
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
});

export default CongratulationModal;
