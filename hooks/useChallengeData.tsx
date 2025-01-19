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
    const currentChallenge = challenges.find((ch) => ch.id.trim() === onboardDay.trim());
    
    if (currentChallenge) {
      // If the challenge is completed, ensure it's moved to completedChallenges only once
      if (completed && challengeProgress === 1) {
        // Check if the current challenge is already in the completedChallenges list
        setCompletedChallenges((prevChallenges) => {
          if (!prevChallenges.some(ch => ch.id === currentChallenge.id)) {
            console.log("Challenge already completed", prevChallenges)
            return [...prevChallenges, currentChallenge];
          }
          return prevChallenges;
        });
        setChallenge(null);
      } else {
        // Otherwise, update current challenge if not completed
        setChallenge({
          id: currentChallenge.id,
          title: currentChallenge.title,
          progress: challengeProgress,
          desc: currentChallenge.desc,
          type: currentChallenge.type
        });
      }
    }

    // Determine the completed challenges based on the onboardDay
    const completedChallengesList = challenges.filter((ch, index) => index < parseInt(onboardDay, 10) - 1);

    // Add previously completed challenges (without current challenge)
    setCompletedChallenges((prevChallenges) => [
      ...completedChallengesList,
      ...prevChallenges,
    ]);

  }, []); // Remove completedChallenges from the dependency array

  // Only run fetchData when the component is focused or mounted
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return { challenge, isCompleted, completedChallenges, fetchData };
}
