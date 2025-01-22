import { useState, useEffect, useCallback } from 'react';
import Challenge, { challenges } from '../app/onboard/onboard_data';
import { getOnboardDay, getIsCompleted, getRecommendation, getChallengeProgress } from '../utils/getFromStorage';
import { useFocusEffect } from '@react-navigation/native';

export function useChallengeData() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);

  const fetchData = useCallback(async () => {
    const recommendation = await getRecommendation();
    const onboardDay = await getOnboardDay();
    const completed = await getIsCompleted();
    let challengeProgress = await getChallengeProgress() as any;
    challengeProgress = Number(challengeProgress);

    console.log("Challenge Progress: ", challengeProgress);
    console.log("Completed Challenges (before state change): ", completedChallenges);

    setIsCompleted(completed);

    // Find the current challenge for the given onboardDay
    const currentChallenge = challenges.find((ch) => ch.id === onboardDay);

    // Determine the completed challenges based on the onboardDay
    const completedChallengesList = challenges.filter((ch, index) => index < onboardDay - 1);

    // Reset and update the completed challenges to avoid duplication
    setCompletedChallenges(completedChallengesList);

    if (currentChallenge) {
      const updatedChallengeDesc = currentChallenge.desc.replace('{x}', recommendation);
      if (completed && challengeProgress === 1) {
        setCompletedChallenges((prevChallenges) => {
          if (!prevChallenges.some(ch => ch.id === currentChallenge.id)) {
            return [...prevChallenges, currentChallenge];
          }
          return prevChallenges;
        });
        setChallenge(null);
      } else {
        setChallenge({
          id: currentChallenge.id,
          title: currentChallenge.title,
          progress: challengeProgress,
          desc: updatedChallengeDesc,
          type: currentChallenge.type
        });
      }
    }

  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return { challenge, isCompleted, completedChallenges, fetchData };
}
