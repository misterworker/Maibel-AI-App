import { IMessage } from 'react-native-gifted-chat';
import {tango, mango, lingo} from '../app/onboard/onboard_data'

export const initiateChatFlow = async (coachName: string, 
    setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>, 
    botAvatar: any, 
    onReadyCallback: () => void,
    onReplyCallback: (question: string) => Promise<string>,
    setTypingState: (isStreaming: boolean) => void,
    setChatComplete: React.Dispatch<React.SetStateAction<boolean>>,
    challengeType: string,
    challengeDocId: any,
    challengeDesc?: any,
    ) => {
  setTypingState(true)
  let dialogueFlow:any = tango
  switch (challengeDocId) {
    case "tango":
      dialogueFlow = tango;
      break;
    case "mango":
      dialogueFlow = mango;
      break;
    case "lingo":
      dialogueFlow = lingo;
      break;
    default:
      dialogueFlow = tango;
      break;
  }
  for (const step of dialogueFlow) {
    await new Promise((resolve) => setTimeout(resolve, step.time || 1000));
    let messageText = typeof step.message === "function" ? step.message(coachName) : step.message;
    if (step.next === "challenge") {
      const [msg_0, msg_1] = step.message.split("|||");
      messageText = `${msg_0} ${challengeDesc} ${msg_1}`
    }
    setMessages((prevMessages) => [
      {
        _id: new Date().getTime(),
        text: messageText,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: coachName,
          avatar: botAvatar,
        },
      },
      ...prevMessages,
    ]);
    if (step.next === "wait_for_ready") {
      setTypingState(false)
      await onReadyCallback();
      setTypingState(true)
    }
    else if (step.next === "wait") {
      setTypingState(false)
      await onReplyCallback(messageText);
      setTypingState(true)
    }
    else if (step.next === "finish") {
      setTypingState(false)
    }
  }
  setTypingState(false);
  if (challengeType == "chat"){
    setChatComplete(true);
  }
};
