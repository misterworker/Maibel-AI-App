import { fetch } from 'expo/fetch';

const callbot_url = process.env.EXPO_PUBLIC_CALLBOT_URL || ""
const validationbot_url = process.env.EXPO_PUBLIC_VALIDATIONBOT_URL || ""

export const botResponse = async (userMessage: string, userId: string, personalityId: string, personality: string[],
  gender: string, background: string,
  onStreamUpdate?: (chunk: string) => void, ) => {
  try {
    const response = await fetch( "http://localhost:8000/chat", { //http://localhost:8000/chat for local
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        message: userMessage,
        userid: userId,
        personalityId: personalityId,
        personalities: personality,
        gender: gender,
        background: background,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Something went wrong');
    }

    if (!response.body) {
      throw new Error('Response body is null.');
    }

    // Ensure the response is a stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Decode and append the streamed chunk
      const chunk = decoder.decode(value, { stream: true });
      accumulatedText += chunk;

      // Notify updates to the caller via callback
      if (onStreamUpdate && typeof onStreamUpdate === 'function') {
        onStreamUpdate(chunk);
      }
    }

    // Return the full accumulated response after the stream ends
    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: accumulatedText,
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
    console.log("ResponseData: ", responseData)

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