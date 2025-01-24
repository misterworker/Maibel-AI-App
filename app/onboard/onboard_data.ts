import { initiateOnboardingFlow } from "@/hooks/useOnboardingFlow";

export const initOnboardStoryData = {
  day1_1: {
    image: require('../../assets/images/onboard/stories/Day1/1.jpg'),
    buttons: [
      { label: "Read The Letter", link: "/onboard/day1_2", marginBottom: 10, style: "gradient" },
    ],
  },
  day1_2: {
    image: require('../../assets/images/onboard/stories/Day1/2.jpg'),
    buttons: [
      { label: "What's in Store for me?", link: "/onboard/day1_3",  marginBottom: 10, style: "gradient" },
      { label: "Hold up, what the heck?!", link: "/onboard/day1_3",  marginBottom: 10, style: "plain" },
    ],
  },
  day1_3: {
    image: require('../../assets/images/onboard/stories/Day1/3.jpg'),
    buttons: [
      { label: "Yes, I accept", link: "/onboard/day1_4",  marginBottom: 10, style: "gradient" },
      { label: "I think I'll pass", link: "/onboard/day1_4",  marginBottom: 10, style: "plain" },
    ],
  },
  day1_4: {
    image: require('../../assets/images/onboard/stories/Day1/4.jpg'),
    buttons: [
      { label: "Build AI companion", link: "/onboard/day1_5",  marginBottom: 10, style: "gradient" },
    ],
  },
  day1_5: {
    image: require('../../assets/images/onboard/stories/Day1/choose-ai.jpg'),
    buttons: [
      { label: "Let's Go!", link: "/onboard/choose-ai",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_1: {
    image: require('../../assets/images/onboard/stories/Day2/1.jpg'),
    buttons: [
      { label: "Is my cousin involved in this?", link: "/onboard/day2_2",  marginBottom: 10, style: "gradient" },
      { label: "What am I missing here?", link: "/onboard/day2_2",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_2: {
    image: require('../../assets/images/onboard/stories/Day2/2.jpg'),
    buttons: [
      { label: "Nobody saw it coming.", link: "/onboard/day2_3",  marginBottom: 10, style: "gradient" },
      { label: "I can't recall what happened.", link: "/onboard/day2_3",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_3: {
    image: require('../../assets/images/onboard/stories/Day2/3.jpg'),
    buttons: [
      { label: "How did it happen?", link: "/onboard/day2_4",  marginBottom: 10, style: "gradient" },
      { label: "Why did she leave me?", link: "/onboard/day2_4",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_4: {
    image: require('../../assets/images/onboard/stories/Day2/4.jpg'),
    buttons: [
      { label: "This is why I kept to myself.", link: "/onboard/day2_5",  marginBottom: 10, style: "gradient" },
      { label: "Life has never been the same.", link: "/onboard/day2_5",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_5: {
    image: require('../../assets/images/onboard/stories/Day2/5.jpg'),
    buttons: [
      { label: "This is why I distanced myself.", link: "/onboard/day2_6",  marginBottom: 10, style: "gradient" },
      { label: "Life has never been the same.", link: "/onboard/day2_6",  marginBottom: 10, style: "gradient" },
    ],
  },
  day2_6: {
    image: require('../../assets/images/onboard/stories/Day2/6.jpg'),
    buttons: [
      { label: "You know what, let's do this.", link: "/(tabs)/chat",  marginBottom: 10, style: "gradient" },
      { label: "I'm not ready for this.", link: "/(tabs)/chat",  marginBottom: 10, style: "gradient" },
    ],
  },
  day3_1: {
    image: require('../../assets/images/onboard/stories/Day3/1.jpg'),
    buttons: [
      { label: "If only they knew the truth", link: "/onboard/day3_2",  marginBottom: 10, style: "gradient" },
    ],
  },
  day3_2: {
    image: require('../../assets/images/onboard/stories/Day3/2.jpg'),
    buttons: [
      { label: "Why am I involved now?", link: "/onboard/day3_3",  marginBottom: 10, style: "gradient" },
      { label: "I will never contact her again.", link: "/onboard/day3_3",  marginBottom: 10, style: "gradient" },
    ],
  },
  day3_3: {
    image: require('../../assets/images/onboard/stories/Day3/3.jpg'),
    buttons: [
      { label: "I'll never catch up to So-Young.", link: "/onboard/day3_4",  marginBottom: 10, style: "gradient" },
      { label: "Why did I let this define me?", link: "/onboard/day3_4",  marginBottom: 10, style: "gradient" },
    ],
  },
  day3_4: {
    image: require('../../assets/images/onboard/stories/Day3/4.jpg'),
    buttons: [
      { label: "I'll destroy her too", link: "/onboard/day3_5",  marginBottom: 10, style: "gradient" },
      { label: "I'll never join in on her games", link: "/onboard/day3_5",  marginBottom: 10, style: "gradient" },
    ],
  },
  day3_5: {
    image: require('../../assets/images/onboard/stories/Day3/5.jpg'),
    buttons: [
      { label: "I want to give this a shot.", link: "/(tabs)/chat",  marginBottom: 10, style: "gradient" },
      { label: "I'll carve my own path.", link: "/(tabs)/chat",  marginBottom: 10, style: "gradient" },
    ],
  },
};

// export const dialogueFlow = [
//   { id: 1, message: (name: string) => `Hi, my name is ${name}.`, next: 2, time: 1500 },
//   { id: 2, message: "To better serve you, I need to understand your lifestyle, preferences, and goals.", next: 3, time: 2000 },
//   { id: 3, message: "Don't worry - this will only take a few minutes.", next: 4, time: 3000 },
//   { id: 4, message: "Be honest about your habits. I'm here to help, not judge. Your secrets are safe with me.", next: 5, time: 3500 },
//   { id: 5, message: "TYPE 'READY' once you're ready to answer 5 short questions.", next: "wait_for_ready", time: 3000 },
//   { id: 6, message: "How many meals do you eat daily?", next: "wait" },
//   { id: 7, message: "How often do you snack in a day? Any specific cravings?", next: "wait" },
//   { id: 8, message: "Any foods you can't eat/don't like?", next: "wait" },
//   { id: 9, message: "How much water do you drink in a day?", next: "wait" },
//   { id: 10, message: "Lastly, share your greatest challenge to eating healthy.", next: "wait" },
//   { id: 11, message: "Thanks for sharing!", next: "finish"}
// ];

export const dialogueFlow = [
  { id: 1, message: (name: string) => `Hi, my name is ${name}.`, next: 2, time: 0 },
  { id: 2, message: "To better serve you, I need to understand your lifestyle, preferences, and goals.", next: 3, time: 0 },
  { id: 3, message: "Don't worry - this will only take a few minutes.", next: 4, time: 0 },
  { id: 4, message: "Be honest about your habits. I'm here to help, not judge. Your secrets are safe with me.", next: 5, time: 0 },
  { id: 5, message: "TYPE 'READY' once you're ready to answer 5 short questions.", next: "wait_for_ready", time: 0 },
  { id: 6, message: "How many meals do you eat daily?", next: "wait" },
  { id: 7, message: "How often do you snack in a day? Any specific cravings?", next: "wait" },
  { id: 8, message: "Any foods you can't eat/don't like?", next: "wait" },
  { id: 9, message: "How much water do you drink in a day?", next: "wait" },
  { id: 10, message: "Lastly, share your greatest challenge to eating healthy.", next: "wait" },
  { id: 11, message: "Thanks for sharing!", next: "finish"}
];

export default interface Challenge {
  id: number;
  type: string;
  title: string;
  desc: string;
  qns?: number;
  progress?: number
}

export const challenges: Challenge[] = [
  { id: 1, type: "chat", title: "Onboarding Questions", desc: "Answer the bot's questions!", qns: 5},
  { id: 2, type: "prog", title: "Drink Water", desc: "Drink {x} {y} of water. Update me whenever you make progress, Good Luck!"},
  { id: 3, type: "prog", title: "Steps", desc: "Walk {x} steps. Your phone will automatically detect the number of steps you've walked."}
]