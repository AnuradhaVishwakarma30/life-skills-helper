// Game step configurations for all 15 tasks
// Each task has multiple steps with a correct/wrong choice and a target scene

export interface GameStepConfig {
  voicePrompt: string;
  correctEmoji: string;
  correctLabel: string;
  wrongEmoji: string;
  wrongLabel: string;
  targetEmoji: string;
  targetLabel: string;
  successEmoji: string;
  successMessage: string;
}

export interface GameConfig {
  title: string;
  emoji: string;
  bgGradient: string;
  accentColor: string;
  steps: GameStepConfig[];
}

export const gameConfigs: Record<string, GameConfig> = {
  'hand-washing': {
    title: 'Hand Washing',
    emoji: '🧼',
    bgGradient: 'from-blue-50 to-cyan-50',
    accentColor: 'blue',
    steps: [
      {
        voicePrompt: 'Take the soap to wash your hands!',
        correctEmoji: '🧼', correctLabel: 'Soap',
        wrongEmoji: '🥛', wrongLabel: 'Milk',
        targetEmoji: '🖐️', targetLabel: 'Hands',
        successEmoji: '🫧', successMessage: 'Bubbles! Great job!',
      },
      {
        voicePrompt: 'Now scrub your hands together!',
        correctEmoji: '🫧', correctLabel: 'Scrub',
        wrongEmoji: '🍕', wrongLabel: 'Pizza',
        targetEmoji: '🖐️', targetLabel: 'Hands',
        successEmoji: '✨', successMessage: 'Scrubbing nicely!',
      },
      {
        voicePrompt: 'Rinse your hands under water!',
        correctEmoji: '💧', correctLabel: 'Water',
        wrongEmoji: '🧃', wrongLabel: 'Juice',
        targetEmoji: '🚰', targetLabel: 'Sink',
        successEmoji: '💦', successMessage: 'All clean!',
      },
    ],
  },
  'road-crossing': {
    title: 'Road Crossing',
    emoji: '🚦',
    bgGradient: 'from-sky-50 to-green-50',
    accentColor: 'amber',
    steps: [
      {
        voicePrompt: 'Stop at the sidewalk edge!',
        correctEmoji: '🛑', correctLabel: 'Stop Sign',
        wrongEmoji: '🏃', wrongLabel: 'Run',
        targetEmoji: '🚶', targetLabel: 'Sidewalk',
        successEmoji: '✅', successMessage: 'Good, you stopped!',
      },
      {
        voicePrompt: 'Look left and right for cars!',
        correctEmoji: '👀', correctLabel: 'Look',
        wrongEmoji: '📱', wrongLabel: 'Phone',
        targetEmoji: '🛣️', targetLabel: 'Road',
        successEmoji: '✅', successMessage: 'Great looking!',
      },
      {
        voicePrompt: 'Walk across the road carefully!',
        correctEmoji: '🚶', correctLabel: 'Walk',
        wrongEmoji: '🏃', wrongLabel: 'Run',
        targetEmoji: '✅', targetLabel: 'Crosswalk',
        successEmoji: '🎉', successMessage: 'You crossed safely!',
      },
    ],
  },
  'cafeteria-behavior': {
    title: 'Cafeteria Behavior',
    emoji: '🍽️',
    bgGradient: 'from-emerald-50 to-green-50',
    accentColor: 'emerald',
    steps: [
      {
        voicePrompt: 'Get in the lunch line quietly!',
        correctEmoji: '🤫', correctLabel: 'Quiet',
        wrongEmoji: '📢', wrongLabel: 'Shout',
        targetEmoji: '👥', targetLabel: 'Line',
        successEmoji: '✅', successMessage: 'Nice and quiet!',
      },
      {
        voicePrompt: 'Choose your food politely!',
        correctEmoji: '🍎', correctLabel: 'Ask Nicely',
        wrongEmoji: '🤚', wrongLabel: 'Grab',
        targetEmoji: '🍽️', targetLabel: 'Tray',
        successEmoji: '✅', successMessage: 'Good manners!',
      },
      {
        voicePrompt: 'Clean up your tray when done!',
        correctEmoji: '🗑️', correctLabel: 'Clean Up',
        wrongEmoji: '🚶', wrongLabel: 'Leave It',
        targetEmoji: '🧹', targetLabel: 'Trash Bin',
        successEmoji: '✨', successMessage: 'All cleaned up!',
      },
    ],
  },
  'tooth-brushing': {
    title: 'Tooth Brushing',
    emoji: '🪥',
    bgGradient: 'from-cyan-50 to-blue-50',
    accentColor: 'cyan',
    steps: [
      {
        voicePrompt: 'Put toothpaste on the brush!',
        correctEmoji: '🪥', correctLabel: 'Toothpaste',
        wrongEmoji: '🧴', wrongLabel: 'Glue',
        targetEmoji: '😁', targetLabel: 'Mouth',
        successEmoji: '✨', successMessage: 'Toothpaste on!',
      },
      {
        voicePrompt: 'Brush your front teeth!',
        correctEmoji: '🦷', correctLabel: 'Brush Front',
        wrongEmoji: '🍭', wrongLabel: 'Candy',
        targetEmoji: '😁', targetLabel: 'Teeth',
        successEmoji: '✨', successMessage: 'Brushing great!',
      },
      {
        voicePrompt: 'Rinse your mouth with water!',
        correctEmoji: '💧', correctLabel: 'Water',
        wrongEmoji: '🥤', wrongLabel: 'Soda',
        targetEmoji: '🚰', targetLabel: 'Sink',
        successEmoji: '💦', successMessage: 'Fresh and clean!',
      },
    ],
  },
  'getting-dressed': {
    title: 'Getting Dressed',
    emoji: '👕',
    bgGradient: 'from-orange-50 to-amber-50',
    accentColor: 'orange',
    steps: [
      {
        voicePrompt: 'Pick out your shirt!',
        correctEmoji: '👕', correctLabel: 'Shirt',
        wrongEmoji: '🧹', wrongLabel: 'Broom',
        targetEmoji: '🧍', targetLabel: 'Body',
        successEmoji: '✅', successMessage: 'Shirt on!',
      },
      {
        voicePrompt: 'Put on your pants!',
        correctEmoji: '👖', correctLabel: 'Pants',
        wrongEmoji: '🎒', wrongLabel: 'Backpack',
        targetEmoji: '🧍', targetLabel: 'Body',
        successEmoji: '✅', successMessage: 'Pants on!',
      },
      {
        voicePrompt: 'Put on your shoes!',
        correctEmoji: '👟', correctLabel: 'Shoes',
        wrongEmoji: '🧤', wrongLabel: 'Gloves',
        targetEmoji: '🦶', targetLabel: 'Feet',
        successEmoji: '✅', successMessage: 'Ready to go!',
      },
    ],
  },
  'making-sandwich': {
    title: 'Making a Sandwich',
    emoji: '🥪',
    bgGradient: 'from-yellow-50 to-amber-50',
    accentColor: 'yellow',
    steps: [
      {
        voicePrompt: 'Get the bread slices!',
        correctEmoji: '🍞', correctLabel: 'Bread',
        wrongEmoji: '🧱', wrongLabel: 'Brick',
        targetEmoji: '🍽️', targetLabel: 'Plate',
        successEmoji: '✅', successMessage: 'Bread is ready!',
      },
      {
        voicePrompt: 'Spread the filling!',
        correctEmoji: '🥜', correctLabel: 'Peanut Butter',
        wrongEmoji: '🎨', wrongLabel: 'Paint',
        targetEmoji: '🍞', targetLabel: 'Bread',
        successEmoji: '✅', successMessage: 'Yummy filling!',
      },
      {
        voicePrompt: 'Cut the sandwich in half!',
        correctEmoji: '🔪', correctLabel: 'Knife',
        wrongEmoji: '🖊️', wrongLabel: 'Pen',
        targetEmoji: '🥪', targetLabel: 'Sandwich',
        successEmoji: '🎉', successMessage: 'Sandwich is ready!',
      },
    ],
  },
  'packing-backpack': {
    title: 'Packing a Backpack',
    emoji: '🎒',
    bgGradient: 'from-teal-50 to-cyan-50',
    accentColor: 'teal',
    steps: [
      {
        voicePrompt: 'Pack your books!',
        correctEmoji: '📚', correctLabel: 'Books',
        wrongEmoji: '⚽', wrongLabel: 'Ball',
        targetEmoji: '🎒', targetLabel: 'Backpack',
        successEmoji: '✅', successMessage: 'Books packed!',
      },
      {
        voicePrompt: 'Pack your pencils and supplies!',
        correctEmoji: '✏️', correctLabel: 'Pencils',
        wrongEmoji: '🍭', wrongLabel: 'Candy',
        targetEmoji: '🎒', targetLabel: 'Backpack',
        successEmoji: '✅', successMessage: 'Supplies packed!',
      },
      {
        voicePrompt: 'Put your lunch inside!',
        correctEmoji: '🥪', correctLabel: 'Lunch',
        wrongEmoji: '🧸', wrongLabel: 'Teddy Bear',
        targetEmoji: '🎒', targetLabel: 'Backpack',
        successEmoji: '✅', successMessage: 'All packed!',
      },
    ],
  },
  'greeting-someone': {
    title: 'Greeting Someone',
    emoji: '👋',
    bgGradient: 'from-rose-50 to-pink-50',
    accentColor: 'rose',
    steps: [
      {
        voicePrompt: 'Smile at the person!',
        correctEmoji: '😊', correctLabel: 'Smile',
        wrongEmoji: '😤', wrongLabel: 'Frown',
        targetEmoji: '👤', targetLabel: 'Person',
        successEmoji: '✅', successMessage: 'Nice smile!',
      },
      {
        voicePrompt: 'Wave and say hello!',
        correctEmoji: '👋', correctLabel: 'Wave',
        wrongEmoji: '👊', wrongLabel: 'Fist',
        targetEmoji: '👤', targetLabel: 'Person',
        successEmoji: '✅', successMessage: 'Hello!',
      },
      {
        voicePrompt: 'Ask how are you?',
        correctEmoji: '💬', correctLabel: 'Ask Nicely',
        wrongEmoji: '🙉', wrongLabel: 'Ignore',
        targetEmoji: '👤', targetLabel: 'Person',
        successEmoji: '❤️', successMessage: 'Great greeting!',
      },
    ],
  },
  'asking-for-help': {
    title: 'Asking for Help',
    emoji: '🙋',
    bgGradient: 'from-sky-50 to-blue-50',
    accentColor: 'sky',
    steps: [
      {
        voicePrompt: 'Find a trusted adult!',
        correctEmoji: '👩‍🏫', correctLabel: 'Teacher',
        wrongEmoji: '🚪', wrongLabel: 'Hide',
        targetEmoji: '👤', targetLabel: 'Adult',
        successEmoji: '✅', successMessage: 'Good choice!',
      },
      {
        voicePrompt: 'Raise your hand politely!',
        correctEmoji: '✋', correctLabel: 'Raise Hand',
        wrongEmoji: '📢', wrongLabel: 'Shout',
        targetEmoji: '👩‍🏫', targetLabel: 'Teacher',
        successEmoji: '✅', successMessage: 'Very polite!',
      },
      {
        voicePrompt: 'Say thank you for the help!',
        correctEmoji: '🙏', correctLabel: 'Thank You',
        wrongEmoji: '🚶', wrongLabel: 'Walk Away',
        targetEmoji: '👩‍🏫', targetLabel: 'Teacher',
        successEmoji: '❤️', successMessage: 'So thankful!',
      },
    ],
  },
  'lunch-manners': {
    title: 'Lunch Table Manners',
    emoji: '🍴',
    bgGradient: 'from-green-50 to-emerald-50',
    accentColor: 'green',
    steps: [
      {
        voicePrompt: 'Put a napkin on your lap!',
        correctEmoji: '🧻', correctLabel: 'Napkin',
        wrongEmoji: '📰', wrongLabel: 'Newspaper',
        targetEmoji: '🧍', targetLabel: 'Lap',
        successEmoji: '✅', successMessage: 'Napkin placed!',
      },
      {
        voicePrompt: 'Use your fork to eat!',
        correctEmoji: '🍴', correctLabel: 'Fork',
        wrongEmoji: '🖐️', wrongLabel: 'Bare Hands',
        targetEmoji: '🍽️', targetLabel: 'Plate',
        successEmoji: '✅', successMessage: 'Great manners!',
      },
      {
        voicePrompt: 'Chew with your mouth closed!',
        correctEmoji: '😊', correctLabel: 'Closed Mouth',
        wrongEmoji: '😮', wrongLabel: 'Open Mouth',
        targetEmoji: '🍽️', targetLabel: 'Food',
        successEmoji: '✅', successMessage: 'Perfect eating!',
      },
    ],
  },
  'riding-bus': {
    title: 'Riding the Bus',
    emoji: '🚌',
    bgGradient: 'from-lime-50 to-green-50',
    accentColor: 'lime',
    steps: [
      {
        voicePrompt: 'Wait at the bus stop!',
        correctEmoji: '🧍', correctLabel: 'Stand Still',
        wrongEmoji: '🏃', wrongLabel: 'Run Around',
        targetEmoji: '🚏', targetLabel: 'Bus Stop',
        successEmoji: '✅', successMessage: 'Good waiting!',
      },
      {
        voicePrompt: 'Find a seat and sit down!',
        correctEmoji: '💺', correctLabel: 'Sit Down',
        wrongEmoji: '🧍', wrongLabel: 'Stand Up',
        targetEmoji: '🚌', targetLabel: 'Bus',
        successEmoji: '✅', successMessage: 'Seated safely!',
      },
      {
        voicePrompt: 'Use a quiet inside voice!',
        correctEmoji: '🤫', correctLabel: 'Whisper',
        wrongEmoji: '📢', wrongLabel: 'Shout',
        targetEmoji: '🚌', targetLabel: 'Bus',
        successEmoji: '✅', successMessage: 'Nice and quiet!',
      },
    ],
  },
  'morning-routine': {
    title: 'Morning Routine',
    emoji: '🌅',
    bgGradient: 'from-amber-50 to-yellow-50',
    accentColor: 'amber',
    steps: [
      {
        voicePrompt: 'Wake up when the alarm rings!',
        correctEmoji: '⏰', correctLabel: 'Alarm',
        wrongEmoji: '😴', wrongLabel: 'Sleep More',
        targetEmoji: '🛏️', targetLabel: 'Bed',
        successEmoji: '☀️', successMessage: 'Good morning!',
      },
      {
        voicePrompt: 'Eat a good breakfast!',
        correctEmoji: '🥣', correctLabel: 'Breakfast',
        wrongEmoji: '🍬', wrongLabel: 'Candy',
        targetEmoji: '🪑', targetLabel: 'Table',
        successEmoji: '✅', successMessage: 'Yummy breakfast!',
      },
      {
        voicePrompt: 'Grab your backpack and go!',
        correctEmoji: '🎒', correctLabel: 'Backpack',
        wrongEmoji: '🧸', wrongLabel: 'Toy',
        targetEmoji: '🚪', targetLabel: 'Door',
        successEmoji: '🎉', successMessage: 'Off to school!',
      },
    ],
  },
  'bedtime-routine': {
    title: 'Bedtime Routine',
    emoji: '🌙',
    bgGradient: 'from-slate-100 to-indigo-50',
    accentColor: 'slate',
    steps: [
      {
        voicePrompt: 'Change into your pajamas!',
        correctEmoji: '🩳', correctLabel: 'Pajamas',
        wrongEmoji: '👔', wrongLabel: 'Suit',
        targetEmoji: '🧍', targetLabel: 'Body',
        successEmoji: '✅', successMessage: 'Cozy pajamas!',
      },
      {
        voicePrompt: 'Brush your teeth before bed!',
        correctEmoji: '🪥', correctLabel: 'Toothbrush',
        wrongEmoji: '🍭', wrongLabel: 'Lollipop',
        targetEmoji: '😁', targetLabel: 'Mouth',
        successEmoji: '✨', successMessage: 'Clean teeth!',
      },
      {
        voicePrompt: 'Get into bed and close your eyes!',
        correctEmoji: '😴', correctLabel: 'Sleep',
        wrongEmoji: '📱', wrongLabel: 'Phone',
        targetEmoji: '🛏️', targetLabel: 'Bed',
        successEmoji: '🌙', successMessage: 'Good night!',
      },
    ],
  },
  'classroom-behavior': {
    title: 'Classroom Behavior',
    emoji: '📖',
    bgGradient: 'from-blue-50 to-indigo-50',
    accentColor: 'blue',
    steps: [
      {
        voicePrompt: 'Enter the classroom quietly!',
        correctEmoji: '🤫', correctLabel: 'Quiet',
        wrongEmoji: '📢', wrongLabel: 'Shout',
        targetEmoji: '🚪', targetLabel: 'Door',
        successEmoji: '✅', successMessage: 'Very quiet!',
      },
      {
        voicePrompt: 'Raise your hand to speak!',
        correctEmoji: '✋', correctLabel: 'Raise Hand',
        wrongEmoji: '🗣️', wrongLabel: 'Blurt Out',
        targetEmoji: '👩‍🏫', targetLabel: 'Teacher',
        successEmoji: '✅', successMessage: 'Good student!',
      },
      {
        voicePrompt: 'Be kind to your classmates!',
        correctEmoji: '❤️', correctLabel: 'Be Kind',
        wrongEmoji: '😠', wrongLabel: 'Be Mean',
        targetEmoji: '👥', targetLabel: 'Friends',
        successEmoji: '❤️', successMessage: 'So kind!',
      },
    ],
  },
  'grocery-shopping': {
    title: 'Grocery Shopping',
    emoji: '🛒',
    bgGradient: 'from-pink-50 to-rose-50',
    accentColor: 'pink',
    steps: [
      {
        voicePrompt: 'Check the shopping list!',
        correctEmoji: '📋', correctLabel: 'List',
        wrongEmoji: '🎮', wrongLabel: 'Game',
        targetEmoji: '👀', targetLabel: 'Eyes',
        successEmoji: '✅', successMessage: 'List checked!',
      },
      {
        voicePrompt: 'Get a cart at the store!',
        correctEmoji: '🛒', correctLabel: 'Cart',
        wrongEmoji: '🛷', wrongLabel: 'Sled',
        targetEmoji: '🏪', targetLabel: 'Store',
        successEmoji: '✅', successMessage: 'Cart ready!',
      },
      {
        voicePrompt: 'Wait patiently at checkout!',
        correctEmoji: '🧍', correctLabel: 'Wait',
        wrongEmoji: '🏃', wrongLabel: 'Push Ahead',
        targetEmoji: '💰', targetLabel: 'Checkout',
        successEmoji: '🎉', successMessage: 'Great shopping!',
      },
    ],
  },
};
