import { saveToSecureStorage } from './SecureStorage';

//! indicators
export const setOnboardDay = async (onboardDay: number) => {
  try {
    await saveToSecureStorage("onboardDay", onboardDay.toString());
  } catch (error) {
    console.error("Error setting onboard day in secure storage", error);
  }
};

export const setIsCompleted = async (isCompleted: boolean) => {
  try {
    await saveToSecureStorage("isCompleted", isCompleted ? "true" : "false");
  } catch (error) {
    console.error("Error setting isCompleted in secure storage", error);
  }
};

export const setOnboardDate = async (onboardDate: string) => {
  try {
    await saveToSecureStorage("onboardDate", onboardDate);
  } catch (error) {
    console.error("Error setting onboard date in secure storage", error);
  }
};

//? Recommendation for current challenge based on user profile
export const setRecomendationVal = async(recVal: string) => {
  try {
    await saveToSecureStorage("recVal", recVal);
  } catch (error) {
    console.error("Error setting recommendation value in secure storage", error);
  }
}

//? Recommendation for current challenge based on user profile
export const setRecomendationUnit = async(recUnit: string) => {
  try {
    await saveToSecureStorage("recUnit", recUnit);
  } catch (error) {
    console.error("Error setting 4 unit in secure storage", error);
  }
}

//? Current Progress for Challenge
export const setChallengeProgress = async(challengeProgress: string) => {
  try {
    await saveToSecureStorage("challengeProgress", challengeProgress);
  } catch (error) {
    console.error("Error setting challengeProgress in secure storage", error);
  }
}

//! User Information
export const setUserID = async (userID: string) => {
  try {
    await saveToSecureStorage("userID", userID);
  } catch (error) {
    console.error("Error setting user ID in secure storage", error);
  }
};

export const setUserInfo = async (userInfo: string) => {
  try {
    await saveToSecureStorage("userInfo", userInfo);
  } catch (error) {
    console.error("Error setting user info in secure storage", error);
  }
};

//! Coach Details
//? Only custom coaches should have gender, personalities and background attribute
export const setCustomCoach = async (coach: any) => {
  try {
    const coachString = JSON.stringify(coach);
    await saveToSecureStorage("coach", coachString);
  } catch (error) {
    console.error("Error setting coach in secure storage", error);
  }
};

export const setCoachId = async (coachId: string) => {
  try {
    await saveToSecureStorage("coachId", coachId);
  } catch (error) {
    console.error("Error setting coach ID in secure storage", error);
  }
};

