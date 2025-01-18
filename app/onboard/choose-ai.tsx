import React from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import CarouselComponent from "../../components/CarouselPageSwipe";
import uuid from 'react-native-uuid';
import { setCoachId, setCustomCoach, setOnboardDay, setOnboardDate, setUserID } from "@/utils/saveToSecureStorage";


const ChooseAI = () => {
  const router = useRouter();

  const handleCoachSelection = async (coachId: string, selectedGender: string, coachName: string, 
    background: string, personalities: string[]) => {
      try {
        const userID = uuid.v4();
        await setCoachId(coachId)
        await setOnboardDay(1);
        await setCustomCoach({
          coachName: coachName,
          gender: selectedGender,
          background: background,
          personality_1: personalities[0],
          personality_2: personalities[1],
          personality_3: personalities[2]
        });
        await setUserID(userID);
        await setOnboardDate(new Date().toISOString().split("T")[0]);
        router.push("/(tabs)/chat");
      } catch (error) {
        console.error("Error saving to secure storage:", error);
      }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <CarouselComponent onCoachSelect={handleCoachSelection} />
    </View>
  );
};

export default ChooseAI;
