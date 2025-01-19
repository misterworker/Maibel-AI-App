import React, { useState, useEffect } from "react";
import { GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import { useTheme } from "../../context/ThemeContext";
import { themeStyles } from "../../context/themeStyles";
import { View, StyleSheet, Text, ImageBackground, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getCoach, getOnboardDay, getUserID, getIsCompleted } from '../../utils/getFromStorage';
import { useChat } from '../../hooks/useChat';
import { Header } from "../../components/Header";
import { SendButton } from "../../components/SendButton";
import { challenges } from "../onboard/onboard_data";
import 'react-native-get-random-values';


//* Onboarding Logic: If today is User's first day, launch bot messages using initiateOnboardingFlow.


export default function Chat() {
  const { theme } = useTheme();
  const currentTheme = themeStyles[theme];

  const [coachBackground, setCoachBackground] = useState(null);
  const [coachName, setCoachName] = useState("");
  const [personality, setPersonality] = useState("");
  const [gender, setGender] = useState("");
  const [coachId, setCoachId] = useState("");
  const [userID, setUserId] = useState("");

  const botAvatar = require("../../assets/images/Stan.jpeg");

  const { messages, isStreaming, challenge, setChallenge, handleSend, handleSendImage } = useChat(
    userID,
    coachId,
    coachName, 
    botAvatar, 
    personality,
    gender,
    coachBackground
  );

  useEffect(() => {
    const fetchAndSetDetails = async () => {
      await setCoachDetails();
      await setChallengeDetails();
    };
  
    fetchAndSetDetails();
  }, [setChallenge]);
  
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
        break;
      case "female_coach":
        background = require("../../assets/images/chat/chat_female.jpg");
        setCoachName("Maibel");
        break;
      case "custom_coach":
        background = require("../../assets/images/onboard/Custom_Coach.jpeg");
        setCoachName(coachName);
        break;
      default:
        background = require("../../assets/images/onboard/Custom_Coach.jpeg");
        setCoachName("Coach");
    }
  
    setPersonality(Array.isArray(personalities) ? personalities.join(", ") : personalities || "");
    setGender(gender || "");
    setCoachId(coachId || "");
    setUserId(userID || "");
    setCoachBackground(background);
  };
  
  const setChallengeDetails = async () => {
    const onboardDay = await getOnboardDay();
    const isCompleted = await getIsCompleted();
    
    if (!isCompleted) {
      const currentChallenge = challenges.find((ch) => {
        return ch.id.trim() === onboardDay.trim();
      });
  
      if (currentChallenge) {
        setChallenge(currentChallenge as any);
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
            messages={messages}
            onSend={(messages) => {
              handleSend(messages, challenge.type)}}
            user={{ _id: 1, name: "User" }}
            placeholder="Type your message..."
            showUserAvatar={true}
            renderAvatarOnTop={true}
            isTyping={isStreaming}
            bottomOffset={50}
            renderActions={() => <SendButton handleSendImage={handleSendImage} />}
            renderInputToolbar={(props) => <InputToolbar {...props} containerStyle={styles.inputContainer} />}
            renderSend={(props) => (
              <Send {...props} containerStyle={styles.sendContainer}>
                <View style={styles.sendButton}>
                  <Ionicons name="send" size={18} color="#fff" />
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
