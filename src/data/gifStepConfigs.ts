import type { GifStepGameConfig } from '../components/games/GifStepGame';

/**
 * Centralized GIF-step configurations for tasks that use the GifStepGame
 * component. Brushing teeth uses its own hybrid component (Lottie + GIF)
 * and is NOT part of this map.
 */
export const gifStepConfigs: Record<string, GifStepGameConfig> = {
  'hand-washing': {
    taskId: 'hand-washing',
    taskName: 'Hand Washing',
    emoji: '🧼',
    gradient: 'from-blue-50 to-cyan-50',
    accentText: 'text-blue-700',
    accentBg: 'bg-blue-500',
    progressBg: 'bg-blue-500',
    steps: [
      {
        title: 'Rinse Your Hands',
        voice: 'First, turn on the tap and rinse your hands with water.',
        buttonLabel: '💧 I rinsed my hands!',
        mediaUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGoyOGV0NTl2cWNuNXJ4eWlrMHJ1djUxOWxkYXQ5enM3d29uZng0cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UB9NClfCUHREVc3mQy/giphy.gif',
      },
      {
        title: 'Apply Handwash',
        voice: 'Now, apply some soap or handwash to your hands.',
        buttonLabel: '🧴 I applied soap!',
        mediaUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHdxNWxuYnBubXNqcnVyOG1iMndoMGhhazF5ZXVjczlmZ2J6bzl2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/eg4Kn343Ch0sWsip69/giphy.gif',
      },
      {
        title: 'Scrub Your Hands',
        voice: 'Rub your palms together to make lots of bubbles.',
        buttonLabel: '🫧 I am scrubbing!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExejN1eG5vbHZxNWJveXA2MTRoYWhsNGZyZXNscG9ocmp5OWM4ZWMwOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Drk7VG2xJDkB59fYoz/giphy.gif',
      },
      {
        title: 'Scrub Your Nails',
        voice: 'Now scrub under your nails to clean them well.',
        buttonLabel: '💅 Nails are clean!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmp3eHFtdTU5YXgweDFlcXg4czE5Y3RsYjJld2twbjhua2U1M2lzeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qO0n01sFCR83e/giphy.gif',
      },
      {
        title: 'Scrub Between Fingers',
        voice: 'Don\'t forget to scrub between your fingers!',
        buttonLabel: '🖐️ Got between fingers!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExN2k1ZzlpbHlvYjRvaDR3YzR0YXA1MWZ1Njlqamt3Nzh0dm5uNWFsMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KDsRQrLhzEac4EzSCd/giphy.gif',
      },
      {
        title: 'Wash Nicely',
        voice: 'Keep washing all over for twenty seconds.',
        buttonLabel: '✨ Washing nicely!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZG83eDJvaHV4ZWZub3pwMmZjem85Z3BxbGExOWQ4ZTJkcmg4cnlqdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/W28BflYUn9LbVolKT2/giphy.gif',
      },
      {
        title: 'Close The Tap',
        voice: 'Now turn off the tap to save water.',
        buttonLabel: '🚰 Tap is closed!',
        mediaUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWBoMzFqbWZ2emtxMG4wYTgxeTA3NjlycDF6ZnBlY29iZXBmN3JkOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lVB8T943vjkc2ndh7n/giphy.gif',
      },
      {
        title: 'Dry Your Hands',
        voice: 'Use a clean towel to dry your hands.',
        buttonLabel: '🌬️ Hands are dry!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXcwNnVramh5bzdhbDQzcWNtdTZhYWZibDNiZndheGFtbjMzZ3F1ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2CTVCsd04kjadFpTSv/giphy.gif',
      },
      {
        title: 'Hands Are Clean!',
        voice: 'Wonderful! Your hands are now sparkling clean!',
        buttonLabel: '🎉 All done!',
        mediaUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXIxYzBhOTdycmd4MXIxcjIwcjNpeWMxc3kzbm01ZWNyYTJ0ZGNqYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TfduKFNDVXoxjsb2lH/giphy.gif',
      },
    ],
  },

  'taking-bath': {
    taskId: 'taking-bath',
    taskName: 'Taking a Bath',
    emoji: '🛁',
    gradient: 'from-sky-50 to-indigo-50',
    accentText: 'text-sky-700',
    accentBg: 'bg-sky-500',
    progressBg: 'bg-sky-500',
    steps: [
      {
        title: 'Apply Soap',
        voice: 'Take some soap and apply it on your body.',
        buttonLabel: '🧼 Soap applied!',
        mediaUrl: 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjRraTBlMDdpNDI0MG4xZTF1eTFvemw1bjUxazlxcmR2dzM0aWtyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jHH7QExuD76II91mQn/giphy.gif',
      },
      {
        title: 'Scrub Gently',
        voice: 'Scrub your body gently with the soap.',
        buttonLabel: '🫧 I am scrubbing!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbWtncXQ5NjZ3OWZmN2dkejRkMmg5cm5vYmI4ZHluNHE2aHZobHd4aCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kggJGMPKuKAayqX7G4/giphy.gif',
      },
      {
        title: 'Wash With Water',
        voice: 'Now rinse all the soap off with clean water.',
        buttonLabel: '💧 All washed!',
        mediaUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmdvNDBza3h4YTZka2Jid2wyNWd1bjd5MDkwOG1vdXR6NjFxb2doOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QbIzmrmUJQCiMoRH8f/giphy.gif',
      },
      {
        title: 'Dry Yourself',
        voice: 'Use a soft towel to dry yourself completely.',
        buttonLabel: '🛁 I am all dry!',
        mediaUrl: 'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3l2d3E0Zjd4c2h3eTM3ODN2d2dhcGhlOTFpN3k2MmsyZGZ5dGg2eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mPvg97p8JPuhiANL3p/giphy.gif',
      },
    ],
  },

  'making-friends': {
    taskId: 'making-friends',
    taskName: 'Making Friends',
    emoji: '🤝',
    gradient: 'from-pink-50 to-rose-50',
    accentText: 'text-rose-700',
    accentBg: 'bg-rose-500',
    progressBg: 'bg-rose-500',
    steps: [
      {
        title: 'Look and Smile',
        voice: 'Make eye contact and give a friendly smile.',
        buttonLabel: '😊 I smiled!',
        mediaUrl: 'https://i.postimg.cc/N0zZGh5H/look.jpg',
      },
      {
        title: 'Say "Hello!"',
        voice: 'Greet your new friend by saying Hello.',
        buttonLabel: '👋 I said Hello!',
        mediaUrl: 'https://i.postimg.cc/Dyhf3sVb/hi.png',
      },
      {
        title: 'Introduce Yourself',
        voice: 'Tell them your name. Say: My name is...',
        buttonLabel: '🙋 I introduced myself!',
        mediaUrl: 'https://i.postimg.cc/JhkSh6Zh/Screenshot-2026-04-24-135447.png',
      },
      {
        title: 'Ask "Can We Play?"',
        voice: 'Find common interests and ask: Can we play together?',
        buttonLabel: '🎉 New friend made!',
        mediaUrl: 'https://i.postimg.cc/7Ps9p1Jt/Screenshot-2026-04-24-135642.png',
      },
    ],
  },

  'eating-manners': {
    taskId: 'eating-manners',
    taskName: 'Eating Manners',
    emoji: '🍽️',
    gradient: 'from-amber-50 to-orange-50',
    accentText: 'text-orange-700',
    accentBg: 'bg-orange-500',
    progressBg: 'bg-orange-500',
    steps: [
      {
        title: 'Sit Up Straight',
        voice: 'Sit straight at the table with both feet on the floor.',
        buttonLabel: '🪑 I am sitting properly!',
      },
      {
        title: 'Use a Napkin',
        voice: 'Place a napkin on your lap and use it to wipe your mouth.',
        buttonLabel: '🧻 Napkin ready!',
      },
      {
        title: 'Chew With Mouth Closed',
        voice: 'Chew your food with your mouth closed. No talking with food in your mouth!',
        buttonLabel: '😋 Chewing nicely!',
      },
      {
        title: 'Clean Up Your Plate',
        voice: 'When you finish, take your plate to the sink.',
        buttonLabel: '🧽 Plate cleaned up!',
      },
    ],
  },

  'dressing-up': {
    taskId: 'dressing-up',
    taskName: 'Dressing Up',
    emoji: '👕',
    gradient: 'from-teal-50 to-emerald-50',
    accentText: 'text-emerald-700',
    accentBg: 'bg-emerald-500',
    progressBg: 'bg-emerald-500',
    steps: [
      {
        title: 'Pick Your Clothes',
        voice: 'Choose the clothes you want to wear today.',
        buttonLabel: '👚 Clothes picked!',
      },
      {
        title: 'Put On Your T-Shirt',
        voice: 'Put your t-shirt on. Head first, then arms.',
        buttonLabel: '👕 T-shirt on!',
      },
      {
        title: 'Put On Your Pants',
        voice: 'Now slide your pants on, one leg at a time.',
        buttonLabel: '👖 Pants on!',
      },
    ],
  },

  'saving-electricity': {
    taskId: 'saving-electricity',
    taskName: 'Saving Electricity',
    emoji: '💡',
    gradient: 'from-yellow-50 to-amber-50',
    accentText: 'text-yellow-700',
    accentBg: 'bg-yellow-500',
    progressBg: 'bg-yellow-500',
    steps: [
      {
        title: 'Check the Room',
        voice: 'Before leaving, look around the room.',
        buttonLabel: '👀 Room checked!',
      },
      {
        title: 'Switch Off the Light',
        voice: 'Press the switch to turn off the lights.',
        buttonLabel: '💡 Light off!',

      },
      {
        title: 'Switch Off the Fan',
        voice: 'Now turn off the fan to save more electricity.',
        buttonLabel: '🌀 Fan off!',
        
    ],
  },
};
