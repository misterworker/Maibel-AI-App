import { getFromSecureStorage } from '../utils/SecureStorage';

//! indicators
export const getOnboardDay = async() => {
  const onboardDay = await getFromSecureStorage("onboardDay") as string
  return (+onboardDay)
};

export const getIsCompleted = async() => {
  const isCompleted = await getFromSecureStorage("isCompleted")
  if (isCompleted === "true") {return true}
  else {
    return false
  }
}

export const getRecommendation = async() => {
  const recommendation = await getFromSecureStorage("recommendation")
  return recommendation as string
}

export const getChallengeProgress = async() => {
  const challengeProgress = await getFromSecureStorage("challengeProgress")
  return challengeProgress as string
}

//! User Information
export const getUserID = async() => {
  const userID = await getFromSecureStorage("userID")
  return (userID)
}

//! Coach Details
export const getCoach = async () => {
  const coachId = await getFromSecureStorage("coachId");
  const coachString = await getFromSecureStorage("coach") || "";
  const coach = JSON.parse(coachString);
  return {
    coachId: coachId,
    coachName: coach.coachName,
    coachBackground: coach.background,
    personalities: [coach.personality_1, coach.personality_2, coach.personality_3].filter(Boolean),
    gender: coach.gender,
  };
};
