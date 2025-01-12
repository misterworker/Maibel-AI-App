import { saveToSecureStorage } from './SecureStorage';

// Function to set onboard day
export const setOnboardDay = async (onboardDay: number) => {
  try {
    await saveToSecureStorage("onboardDay", onboardDay.toString());
  } catch (error) {
    console.error("Error setting onboard day in secure storage", error);
  }
};

// Function to set user ID
export const setUserID = async (userID: string) => {
  try {
    await saveToSecureStorage("userID", userID);
  } catch (error) {
    console.error("Error setting user ID in secure storage", error);
  }
};

// Function to set completion status
export const setIsCompleted = async (isCompleted: boolean) => {
  try {
    await saveToSecureStorage("isCompleted", isCompleted ? "true" : "false");
  } catch (error) {
    console.error("Error setting isCompleted in secure storage", error);
  }
};

// Function to set coach ID
export const setCoachId = async (coachId: string) => {
  try {
    await saveToSecureStorage("coachId", coachId);
  } catch (error) {
    console.error("Error setting coach ID in secure storage", error);
  }
};

// Function to set user's name
export const setName = async (name: string) => {
  try {
    await saveToSecureStorage("name", name);
  } catch (error) {
    console.error("Error setting name in secure storage", error);
  }
};

// Function to set coach background
export const setCoachBackground = async (background: string) => {
  try {
    await saveToSecureStorage("background", background);
  } catch (error) {
    console.error("Error setting coach background in secure storage", error);
  }
};

// Function to set personalities
export const setPersonalities = async (personalities: string[]) => {
  try {
    for (let i = 0; i < personalities.length; i++) {
      await saveToSecureStorage(`personality_${i + 1}`, personalities[i]);
    }
  } catch (error) {
    console.error("Error setting personalities in secure storage", error);
  }
};

// Function to set gender
export const setGender = async (gender: string) => {
  try {
    await saveToSecureStorage("selectedGender", gender);
  } catch (error) {
    console.error("Error setting gender in secure storage", error);
  }
};
