import { router } from 'expo-router';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, StyleSheet } from 'react-native';

interface ChallengeNotificationProps {
  message: string;
  onClick: () => void;
}

const ChallengeNotification: React.FC<ChallengeNotificationProps> = ({ message, onClick }) => {
  const [visible, setVisible] = useState(true);
  const [dimmed, setDimmed] = useState(false);
  const slideAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setVisible(false); // Mark as not visible after fade out
        });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const handlePress = () => {
    setDimmed(true);
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
    onClick();
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.notification,
          { transform: [{ translateY: slideAnim }], opacity: opacityAnim },
          dimmed && styles.dimmed,
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.touchableArea}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  notification: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchableArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dimmed: {
    backgroundColor: '#388E3C',
  },
  message: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChallengeNotification;
