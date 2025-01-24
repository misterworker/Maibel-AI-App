import React, { useState, useEffect, useCallback } from "react";
import { GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import { useTheme } from "../../context/ThemeContext";
import { themeStyles } from "../../context/themeStyles";
import { View, StyleSheet, Text, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCoach, getOnboardDay, getUserID, getIsCompleted, getRecommendationVal, getRecommendationUnit } from '../../utils/getFromStorage';
import { useChat } from '../../hooks/useChat';
import { Header } from "../../components/Header";
import { SendButton } from "../../components/SendButton";
import { challenges } from "../onboard/onboard_data";
import { useFocusEffect } from '@react-navigation/native';
import 'react-native-get-random-values';


//* Onboarding Logic: If today is User's first day, launch bot messages using initiateOnboardingFlow.


export default function Chat() {
  const maxCharacters = 1000;
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme];

  const [coachBackground, setCoachBackground] = useState(null);
  const [coachName, setCoachName] = useState("");
  const [personality, setPersonality] = useState("");
  const [gender, setGender] = useState("");
  const [coachId, setCoachId] = useState("");
  const [userID, setUserId] = useState("");
  const [onboardDay, setOnboardDay] = useState(0);
  const [botAvatar, setBotAvatar] = useState(require("../../assets/images/chat/custom_coach_avatar.jpg"));

  const { messages, isStreaming, challenge, setChallenge, setChallengeDesc, handleSend, handleSendImage } = useChat(
    userID,
    coachId,
    coachName, 
    botAvatar, 
    personality,
    gender,
    coachBackground,
  );

  useEffect(() => {
    const fetchAndSetOnboardDay = async () => {
      const onboardDay = await getOnboardDay();
      setOnboardDay(onboardDay);
      await setCoachDetails();
    };

    fetchAndSetOnboardDay();
  }, []); // Only runs once on component mount

  useEffect(() => {
    const fetchAndSetDetails = async () => {
      await setCoachDetails();
      await setChallengeDetails();
    };

    if (onboardDay !== null) {
      fetchAndSetDetails();
    }
  }, [onboardDay]); // Runs whenever onboardDay changes
  
  const setCoachDetails = async () => {
    const coachDetails = await getCoach();
    const coachId = coachDetails.coachId;
    const coachName = coachDetails.coachName;
    const personalities = coachDetails.personalities;
    const gender = coachDetails.gender;
  
    const userID = await getUserID() || "123";
  
    let background;
    switch (coachId) {
      case "male_coach":
        background = require("../../assets/images/chat/chat_male.jpg");
        setCoachName("Ethain");
        setBotAvatar(require("../../assets/images/chat/male_avatar.jpg"))
        break;
      case "female_coach":
        background = require("../../assets/images/chat/chat_female.jpg");
        setCoachName("Maibel");
        setBotAvatar(require("../../assets/images/chat/female_avatar.jpg"))
        break;
      case "custom_coach":
        background = require("../../assets/images/chat/chat_custom_coach.jpg");
        setCoachName(coachName);
        setBotAvatar(require("../../assets/images/chat/custom_coach_avatar.jpg"))
        break;
      default:
        background = require("../../assets/images/chat/chat_custom_coach.jpg");
        setCoachName("Coach");
        setBotAvatar(require("../../assets/images/chat/custom_coach_avatar.jpg"))
    }
  
    setPersonality(Array.isArray(personalities) ? personalities.join(", ") : personalities || "");
    setGender(gender || "");
    setCoachId(coachId || "");
    setUserId(userID || "");
    setCoachBackground(background);
  };
  
  const setChallengeDetails = async () => {
    const isCompleted = await getIsCompleted();
    
    if (!isCompleted) {
      const currentChallenge = challenges.find((ch) => {
        return ch.id === onboardDay;
      });
  
      if (currentChallenge) {
        setChallenge(currentChallenge as any);
        const recVal = await getRecommendationVal();
        const recUnit = await getRecommendationUnit();
        const updatedChallengeDesc = currentChallenge.desc.replace('{x}', recVal).replace('{y}', recUnit);
        setChallengeDesc(updatedChallengeDesc)
      }
    }
  };

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: "#000",
    },
    container: {
      flex: 1,
      backgroundColor: currentTheme.background,
    },
    inputContainer: {
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 30,
      borderWidth: 1,
      borderColor: "#ddd",
      paddingHorizontal: 15,
      backgroundColor: "#fff",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    sendButton: {
      marginBottom: 5,
      backgroundColor: "#007AFF",
      borderRadius: 20,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
      elevation: 2,
    },
    sendContainer: {},
  });

  useFocusEffect(
    useCallback(() => {
      const modifyOnboardDay = async () => {
        const onboardDay = await getOnboardDay();
        setOnboardDay(onboardDay);
        await setCoachDetails();
      };
      modifyOnboardDay();

    }, [])
  );

  return coachBackground ? (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
        <ImageBackground
          source={coachBackground}
          style={[styles.container, { paddingBottom: 0 }]}
          resizeMode="cover"
        >
          <Header coachName={coachName} botAvatar={botAvatar} />
          <GiftedChat
            maxInputLength={maxCharacters}
            messages={messages}
            onSend={(messages) => {
              if (!isStreaming) {
                handleSend(messages, challenge);
              }
            }}
            user={{ _id: 1, name: "User" }}
            placeholder="Type your message..."
            showUserAvatar={true}
            renderAvatarOnTop={true}
            isTyping={isStreaming}
            bottomOffset={50}
            renderActions={() => <SendButton handleSendImage={handleSendImage} />}
            renderInputToolbar={(props) => <InputToolbar {...props} containerStyle={styles.inputContainer} />}
            renderSend={(props) => (
              <Send {...props} containerStyle={styles.sendContainer} disabled={isStreaming}>
                <View
                  style={[
                    styles.sendButton,
                    isStreaming && { backgroundColor: "#ccc" },
                  ]}
                >
                  <Ionicons name="send" size={18} color={isStreaming ? "#888" : "#fff"} />
                </View>
              </Send>
            )}
          />
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  ) : (
    <View style={styles.container}>
      <Text>Loading...</Text>
    </View>
  );
}
