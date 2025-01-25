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

export const getRecommendationVal = async() => {
  const recommendationVal = await getFromSecureStorage("recVal") as string
  return +recommendationVal
}

export const getRecommendationUnit = async() => {
  const recommendationUnit = await getFromSecureStorage("recUnit") as string
  return recommendationUnit
}

export const getChallengeProgress = async() => {
  const challengeProgress = await getFromSecureStorage("challengeProgress") as string
  if (!challengeProgress || challengeProgress == "NaN"){
    return 0.0
  }
  return +challengeProgress
}

//! User Information
export const getUserID = async() => {
  const userID = await getFromSecureStorage("userID")
  return (userID)
}

export const getUserInfo = async() => {
  const userInfo = await getFromSecureStorage("userInfo")
  return (userInfo)
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

