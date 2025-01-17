import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Confetti: React.FC = () => {
  return (
    <View style={styles.overlay}>
      <LottieView
        style={styles.lottie}
        source={require('../assets/gifs/confetti.json')}
        autoPlay
        loop={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute', // Overlay over other components
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it is on top of other content
  },
  lottie: {
    width: 400, // Set the width and height as needed
    height: 400,
  },
});

export default Confetti;
