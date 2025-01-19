import { initiateOnboardingFlow } from "@/hooks/useOnboardingFlow";

export const initOnboardStoryData = {
  initOnboard_1_day1: {
    image: require('../../assets/images/onboard/story_onboard_1.jpg'),
    buttons: [
      { label: "Read The Letter", link: "/onboard/initOnboard_2_day1", marginBottom: 25, style: "gradient" },
    ],
  },
  initOnboard_2_day1: {
    image: require('../../assets/images/onboard/story_onboard_2.jpg'),
    buttons: [
      { label: "What's in Store for me?", link: "/onboard/initOnboard_3_day1",  marginBottom: 20, style: "gradient" },
      { label: "Hold up, what the heck?!", link: "/onboard/initOnboard_3_day1",  marginBottom: 25, style: "plain" },
    ],
  },
  initOnboard_3_day1: {
    image: require('../../assets/images/onboard/story_onboard_3.jpg'),
    buttons: [
      { label: "Yes, I accept", link: "/onboard/initOnboard_4_day1",  marginBottom: 15, style: "gradient" },
      { label: "I think I'll pass", link: "/onboard/initOnboard_4_day1",  marginBottom: 25, style: "plain" },
    ],
  },
  initOnboard_4_day1: {
    image: require('../../assets/images/onboard/story_onboard_4.jpg'),
    buttons: [
      { label: "Build AI companion", link: "/onboard/initOnboard_5_day1",  marginBottom: 25, style: "gradient" },
    ],
  },
  initOnboard_5_day1: {
    image: require('../../assets/images/onboard/choose-ai.jpg'),
    buttons: [
      { label: "Let's Go!", link: "/onboard/choose-ai",  marginBottom: 50, style: "gradient" },
    ],
  },
};

export const dialogueFlow = [
  { id: 1, message: (name: string) => `Hi, my name is ${name}.`, next: 2, time: 1500 },
  { id: 2, message: "To better serve you, I need to understand your lifestyle, preferences, and goals.", next: 3, time: 2000 },
  { id: 3, message: "Don't worry - this will only take a few minutes.", next: 4, time: 3000 },
  { id: 4, message: "Be honest about your habits. I'm here to help, not judge. Your secrets are safe with me.", next: 5, time: 3500 },
  { id: 5, message: "TYPE 'READY' once you're ready to answer 5 short questions.", next: "wait_for_ready", time: 3000 },
  { id: 6, message: "How many meals do you eat daily?", next: "wait" },
  { id: 7, message: "How often do you snack in a day? Any specific cravings?", next: "wait" },
  { id: 8, message: "Any foods you can't eat/don't like?", next: "wait" },
  { id: 9, message: "How much water do you drink in a day?", next: "wait" },
  { id: 10, message: "Lastly, share your greatest challenge to eating healthy.", next: "wait" },
  { id: 11, message: "Thanks for sharing!", next: "finish"}
];

export default interface Challenge {
  id: string;
  type: string;
  title: string;
  desc: string;
  qns?: number;
  progress?: number
}

export const challenges: Challenge[] = [
  { id: "1", type: "chat", title: "Onboarding Questions", desc: "Answer the bot's questions!", qns: 5},
  { id: "2", type: "prog", title: "drink water", desc: "Drink {$liters} liters of water"}

]