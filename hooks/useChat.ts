import { useState, useCallback, useRef, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { botResponse, validateResponse } from "../utils/botApi";
import * as ImagePicker from "expo-image-picker";
import { initiateOnboardingFlow } from "./useOnboardingFlow";

export const useChat = (
  coachId: string,
  coachName: string,
  botAvatar: any,
  personality: any,
  gender: any,
  coachBackgroundDesc: any
) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [challenge, setChallenge] = useState("none");
  const [buttons, setButtons] = useState<string[]>([]);
  const [buttonsEnabled, setButtonsEnabled] = useState(false);

  const readyPromiseRef = useRef<(() => void) | null>(null);
  const replyPromiseRef = useRef<((reply: string) => void) | null>(null);

  const handleSend = useCallback(
    (newMessages: IMessage[] = [], challenge: string) => {
      const userMessage = newMessages[0];

      if (userMessage && userMessage.text) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

        if (challenge == "none") {
          setIsStreaming(true);

          botResponse(userMessage.text, 123, coachId, personality, gender, coachBackgroundDesc)
          .then((botMessage) => {
            setMessages((prevMessages) => [
              {
                _id: new Date().getTime(),
                text: botMessage.text,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: coachName,
                  avatar: botAvatar,
                },
              },
              ...prevMessages,
            ]);
            setIsStreaming(false);
          })
          .catch((error) => {
            setMessages((prevMessages) => [
              {
                _id: new Date().getTime(),
                text: `Error: ${error.message}`,
                createdAt: new Date(),
                user: {
                  _id: 2,
                  name: coachName,
                  avatar: botAvatar,
                },
              },
              ...prevMessages,
            ]);
            setIsStreaming(false);
          });
        } else if (challenge == "onboard") {
          if (userMessage.text.toUpperCase() === "READY") {
            setButtonsEnabled(true);
            if (readyPromiseRef.current) {
              readyPromiseRef.current();
              readyPromiseRef.current = null;
            }
          }

          if (replyPromiseRef.current) {
            setIsStreaming(true)
            replyPromiseRef.current(userMessage.text);
            replyPromiseRef.current = null;
          }
        }
      }
    },
    [coachId, coachName, botAvatar, personality, gender, coachBackgroundDesc]
  );

  const waitForReady = () => {
    return new Promise<void>((resolve) => {
      readyPromiseRef.current = resolve;
    });
  };

  // const waitForReply = () => {
  //   return new Promise<void>((resolve) => {
  //     replyPromiseRef.current = resolve;
  //   });
  // };

  const waitForReply = (question: string) => {
    return new Promise<string>(async (resolve) => {
      let validResponse = false;
      while (!validResponse) {
        
        const userReply = await new Promise<string>((innerResolve) => {
          replyPromiseRef.current = innerResolve; // Resolving user reply input
        });
  
        const { isValid, manipulative, nudge } = await validateResponse(question, userReply);
  
        if (manipulative) {
          setIsStreaming(false)
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: new Date().getTime(),
                text: "Please refrain from attempting to manipulate the bot.",
                createdAt: new Date(),
                user: { _id: 2, name: coachName, avatar: botAvatar },
              },
            ])
          );
        } else if (!isValid) {
          setIsStreaming(false)
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [
              {
                _id: new Date().getTime(),
                text: nudge,
                createdAt: new Date(),
                user: { _id: 2, name: coachName, avatar: botAvatar },
              },
            ])
          );
        } else {
          // Valid response received, break the loop and resolve the reply
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    if (challenge == "onboard") {
      const startOnboarding = async () => {
        await initiateOnboardingFlow(
          coachName,
          setMessages,
          botAvatar,
          waitForReady,
          waitForReply,
          setIsStreaming,
          () => setChallenge("onboard")
        );
      };

      startOnboarding();
    }
  }, [challenge]);

  return {
    messages,
    isStreaming,
    challenge,
    setChallenge,
    handleSend,
    handleSendImage,
  };
};
