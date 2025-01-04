export const botResponse = async (
  userMessage: string,
  userId: number,
  personalityId: string,
  personality: string[],
  gender: string,
  background: string
) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

    const responseData = await response.json();
    const botMessage = responseData.response;

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
    const response = await fetch('http://127.0.0.1:8000/validate_response', {
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
      isValid: responseData.isValid,
      nudge: responseData.nudge,
      manipulative: responseData.manipulative,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: null,
        nudge: null,
        manipulative: null,
        error: `Error: ${error.message}`,
      };
    } else {
      return {
        isValid: null,
        nudge: null,
        manipulative: null,
        error: 'An unknown error occurred.',
      };
    }
  }
};