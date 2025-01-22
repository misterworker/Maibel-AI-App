import { fetch } from 'expo/fetch';
import { getChallengeProgress, getIsCompleted, getUserInfo } from './getFromStorage';
import { setChallengeProgress, setIsCompleted } from './saveToSecureStorage';

const callbot_url = process.env.EXPO_PUBLIC_CALLBOT_URL || ""
const validationbot_url = process.env.EXPO_PUBLIC_VALIDATIONBOT_URL || ""

export const botResponse = async (
  userMessage: string,
  userId: string,
  coachId: string,
  personality: string[],
  coachName: string,
  gender: string,
  background: string,
  challenge: string,
) => {
  const fetchStuff = async () => {
    const isCompleted = await getIsCompleted()
    const challengeProgress = await getChallengeProgress()
    console.log(challengeProgress)
    return [isCompleted, challengeProgress]
  };
  try {
    const [isCompleted, challengeProgress] = await fetchStuff();
    console.log("Challenge Progress: ", challengeProgress)

    const response = await fetch("https://callbot-fastapi-78306345447.asia-southeast1.run.app/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        userid: userId,
        challenge: challenge,
        coachId: coachId,
        personalities: personality,
        name: coachName,
        gender: gender,
        background: background,
        isComplete: isCompleted,
        challengeProgress: challengeProgress,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    const responseData = await response.json();
    console.log("response data: ", responseData)
    const botMessage = responseData.response;
    const progressAmt = responseData.progressAmt;

    await setChallengeProgress(progressAmt + challengeProgress);
    console.log(progressAmt + challengeProgress)

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: botMessage,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: `Error: ${error.message}`,
      };
    } else {
      return {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'An unknown error occurred.',
      };
    }
  }
};


export const validateResponse = async (
  question: string,
  reply: string,
) => {
  try {
    const response = await fetch(validationbot_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question,
        reply: reply,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong with the validation bot.');
    }

    const responseData = await response.json();

    // Assuming response has fields logic_rating, nudge, and manipulative
    return {
      isNonsense: responseData.isNonsense,
      nudge: responseData.nudge,
      manipulative: responseData.manipulative,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        isNonsense: null,
        nudge: null,
        manipulative: null,
        error: `Error: ${error.message}`,
      };
    } else {
      return {
        isNonsense: null,
        nudge: null,
        manipulative: null,
        error: 'An unknown error occurred.',
      };
    }
  }
};

export const recommendationResponse = async (
  challenge: string
) => {
  const fetchStuff = async () => {
    const userInfo = await getUserInfo()
    console.log("getting user info: ", userInfo)
    return userInfo
  };
  try {
    const userInfo = await fetchStuff();
    const response = await fetch("https://validation-bot-fastapi-78306345447.asia-southeast1.run.app/rec_x_challenge", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        challenge: challenge,
        userData: userInfo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong with the recommendation bot.');
    }

    const responseData = await response.json();

    console.log("Response Data Recommendation: ", responseData)

    return {
      recommendation: responseData.recommendation,
      unit: responseData.unit,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        recommendation: null,
        unit: null,
        error: `Error: ${error.message}`,
      };
    } else {
      return {
        recommendation: null,
        unit: null,
        error: 'An unknown error occurred.',
      };
    }
  }
};