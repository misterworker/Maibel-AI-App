import { useState, useCallback, useRef, useEffect } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { botResponse, validateResponse } from "../utils/botApi";
import * as ImagePicker from "expo-image-picker";
import { initiateOnboardingFlow } from "./useOnboardingFlow";
import { toggleChallengeCompleted } from "../utils/SecureStorage"
import { router } from "expo-router";

export const useChat = (
  userId: string,
  coachId: string,
  coachName: string,
  botAvatar: any,
  personality: any,
  gender: any,
  coachBackgroundDesc: any
) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [challenge, setChallenge] = useState({ id: 0, type: "none", title: "none", desc: "none"});

  const readyPromiseRef = useRef<(() => void) | null>(null);
  const replyPromiseRef = useRef<((reply: string) => void) | null>(null);

  const handleSend = useCallback(
    (newMessages: IMessage[] = [], challengeType: string) => {
      const userMessage = newMessages[0];
      if (userMessage && userMessage.text) {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));

        if (challengeType == "none" || challengeType=="prog") {
          setIsStreaming(true);

          botResponse(userMessage.text, userId, coachId, personality, gender, coachBackgroundDesc, (chunk) => {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[0];
              if (lastMessage && lastMessage.user._id === 2 && lastMessage.text.startsWith("...")) {
                const updatedMessage = {
                  ...lastMessage,
                  text: lastMessage.text + chunk,
                };
                return [updatedMessage, ...prevMessages.slice(1)];
              } else {
                return [
                  {
                    _id: new Date().getTime(),
                    text: "..." + chunk,
                    createdAt: new Date(),
                    user: {
                      _id: 2,
                      name: coachName,
                      avatar: botAvatar,
                    },
                  },
                  ...prevMessages,
                ];
              }
            });
          }).then((botMessage) => {
            setMessages((previousMessages) => {
              const updatedMessages = [
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
                ...previousMessages.slice(1),
              ];
              return updatedMessages;
            });
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
            setIsStreaming(true)
            replyPromiseRef.current(userMessage.text);
            replyPromiseRef.current = null;
          }
        }
        
      }
    },
    [userId, coachId, coachName, botAvatar, personality, gender, coachBackgroundDesc]
  );
  
  const markChallengeAsCompleted = async () => {
    toggleChallengeCompleted(true); // Mark the challenge as completed
    router.push({ pathname: '/profile', params: { isCompleted: 'false' } });
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
              {
                _id: new Date().getTime(),
                text: "Please refrain from attempting to manipulate the bot.",
                createdAt: new Date(),
                user: { _id: 2, name: coachName, avatar: botAvatar },
              },
            ])
          );
        } else if (isNonsense) {
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
    else if (challenge.type === "prog") {
      const startNewChallenge = async() => {
        setIsStreaming(true);
        setTimeout(() => {
          setMessages((prevMessages) => [
            {
              _id: new Date().getTime(),
              text: challenge.desc,
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
        }, 2000);
      }
      startNewChallenge();
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
