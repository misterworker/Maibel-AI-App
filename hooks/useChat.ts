import { useState, useCallback, useRef, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { botResponse, validateResponse } from "../utils/botApi";
import * as ImagePicker from "expo-image-picker";
import { initiateOnboardingFlow } from "./useOnboardingFlow";
import { toggleChallengeCompleted } from "../utils/SecureStorage"
import { router, useFocusEffect } from "expo-router";
import { setChallengeProgress, setUserInfo } from "@/utils/saveToSecureStorage";
import { getChallengeProgress, getUserInfo } from "@/utils/getFromStorage";
import { useNotification } from "../context/NotificationContext";
import Challenge from "../app/onboard/onboard_data";


const createMessage = (text: string, userId: number, userName: string, userAvatar: any) => {
  return {
    _id: new Date().getTime(),
    text,
    createdAt: new Date(),
    user: {
      _id: userId,
      name: userName,
      avatar: userAvatar,
    },
  };
};


export const useChat = (
  userId: string,
  coachId: string,
  coachName: string,
  botAvatar: any,
  personality: any,
  gender: any,
  coachBackgroundDesc: any,
) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [challenge, setChallenge] = useState({ id: 0, type: "none", title: "none", desc: "none", qns: 0});
  const [challengeDesc, setChallengeDesc] = useState("");

  const readyPromiseRef = useRef<(() => void) | null>(null);
  const replyPromiseRef = useRef<((reply: string) => void) | null>(null);

  const incrementChallengeProgress = async () => {
    try {
      const curChallengeProgress = await getChallengeProgress();
      const totalQuestions = challenge.qns;
      
      const currentProgress = curChallengeProgress ? parseFloat(curChallengeProgress) : 0;
  
      let newChallengeProgress = currentProgress + 1 / totalQuestions;
      newChallengeProgress = Math.min(newChallengeProgress, 1);
      newChallengeProgress = parseFloat(newChallengeProgress.toFixed(2));
  
      await setChallengeProgress(newChallengeProgress.toString());
    } catch (error) {
      console.error("Error updating challenge progress", error);
    }
};

  

  const handleSend = useCallback(
    (newMessages: IMessage[] = [], challenge: Challenge) => {
      const userMessage = newMessages[0];
      if (userMessage && userMessage.text) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
        const challengeType = challenge.type
        if (challengeType == "none" || challengeType == "prog") {
          setIsStreaming(true);
          botResponse(userMessage.text, userId, coachId, personality, coachName, gender, coachBackgroundDesc, challengeDesc)
          .then((botMessage) => {
            const finalProg = botMessage.finalProg || "NA"
            if (finalProg !== "NA") {
              if (+finalProg >= 1) {
                markChallengeAsCompleted();
              }
            }
            setMessages((prevMessages) => [
              createMessage(botMessage.text, 2, coachName, botAvatar),
              ...prevMessages,
            ]);
            setIsStreaming(false);
          })
          .catch((error) => {
            setMessages((prevMessages) => [
              createMessage(`Error: ${error.message}`, 2, coachName, botAvatar),
              ...prevMessages,
            ]);
            setIsStreaming(false);
          });
        } else if (challengeType == "chat") {
          if (userMessage.text.toUpperCase().startsWith("READY")) {
            if (readyPromiseRef.current) {
              readyPromiseRef.current();
              readyPromiseRef.current = null;
            }
          }

          if (replyPromiseRef.current) {
            setIsStreaming(true);
            replyPromiseRef.current(userMessage.text);
            replyPromiseRef.current = null;
          }
        }
      }
    },
    [userId, coachId, coachName, botAvatar, personality, gender, coachBackgroundDesc]
  );
  
  const { showNotification } = useNotification();

  const markChallengeAsCompleted = async () => {
    toggleChallengeCompleted(true);
    showNotification("Challenge completed!", () => {
      router.push({ 
        pathname: '/profile'
      });
    });
  };

  const saveUserInfo = async (question: string, value: string) => {
    try {
      const existingData = await getUserInfo();
      const parsedData = existingData ? JSON.parse(existingData) : {};
  
      if (typeof parsedData !== "object" || Array.isArray(parsedData)) {
        throw new Error("Stored user info is not a valid object.");
      }
  
      const updatedData = { ...parsedData, [question]: value };
      await setUserInfo(JSON.stringify(updatedData));
    } catch (error) {
      console.error("Error saving user info:", error);
    }
  };
  
  const waitForReady = () => {
    return new Promise<void>((resolve) => {
      readyPromiseRef.current = resolve;
    });
  };

  const waitForReply = (question: string) => {
    return new Promise<string>(async (resolve) => {
      let validResponse = false;
      while (!validResponse) {
        
        const userReply = await new Promise<string>((innerResolve) => {
          replyPromiseRef.current = innerResolve; // Resolving user reply input
        });
  
        const { isNonsense, manipulative, nudge } = await validateResponse(question, userReply);

        if (manipulative) {
          setIsStreaming(false)
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              createMessage("Manipulation Detected. Please refrain from deceptive tactics.", 2, coachName, botAvatar),
            ])
          );
        } else if (isNonsense) {
          setIsStreaming(false)
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              createMessage(nudge, 2, coachName, botAvatar),
            ])
          );
        } else {
          // Valid response received, break the loop and resolve the reply
          incrementChallengeProgress()
          await saveUserInfo(question, userReply);
          validResponse = true;
          resolve(userReply);  // Return the valid reply
        }
      }
    });
  };
  

  // Function to handle sending an image
  const handleSendImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access the gallery is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
    });

    if (!pickerResult.canceled) {
      const imageMessage = {
        _id: new Date().getTime(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: 1,
        },
        image: pickerResult.assets[0].uri,
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [imageMessage]));
    }
  };

  useEffect(() => {
    if (challenge.type === "chat") {
      const startOnboarding = async () => {
        await initiateOnboardingFlow(
          coachName,
          setMessages,
          botAvatar,
          waitForReady,
          waitForReply,
          setIsStreaming,
          markChallengeAsCompleted
        );
      };

      startOnboarding();
    }
    if (challenge.type === "prog") {
      const startNewChallenge = async () => {
        setIsStreaming(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMessages((prevMessages) => [
          createMessage("Welcome Back!", 2, coachName, botAvatar),
          ...prevMessages,
        ]);
        setIsStreaming(false)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsStreaming(true)
        await new Promise(resolve => setTimeout(resolve, 2000));
        setMessages((prevMessages) => [
          createMessage(challengeDesc, 2, coachName, botAvatar),
          ...prevMessages,
        ]);
  
        setIsStreaming(false);
      };
  
      startNewChallenge();
    }
  }, [challengeDesc]);
  
  return {
    messages,
    isStreaming,
    challenge,
    setChallenge,
    setChallengeDesc,
    handleSend,
    handleSendImage,
  };
};
