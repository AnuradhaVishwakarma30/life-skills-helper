import { SortingConfig } from '../components/games/SortingZoneGame';

export const sortingConfigs: Record<string, SortingConfig> = {
  'kitchen-safety': {
    taskId: 'kitchen-safety',
    taskName: 'Kitchen Safety',
    colorBg: 'bg-red-500',
    colorText: 'text-red-600',
    voiceIntro: 'Let us sort kitchen items! Some things are hot and some are cold. Be careful!',
    zones: ['Hot 🔥', 'Cold ❄️'],
    zoneEmojis: ['🔥', '❄️'],
    items: [
      { id: 'stove', label: 'Stove', iconName: 'Flame', correctZone: 0 },
      { id: 'ice-cream', label: 'Ice Cream', iconName: 'IceCreamCone', correctZone: 1 },
      { id: 'oven', label: 'Oven', iconName: 'CookingPot', correctZone: 0 },
      { id: 'popsicle', label: 'Popsicle', iconName: 'Cherry', correctZone: 1 },
    ],
  },
  'laundry-sorting': {
    taskId: 'laundry-sorting',
    taskName: 'Laundry Sorting',
    colorBg: 'bg-violet-500',
    colorText: 'text-violet-600',
    voiceIntro: 'Time to sort the laundry! Put light clothes in one pile and dark clothes in the other.',
    zones: ['Lights', 'Darks'],
    zoneEmojis: ['☀️', '🌙'],
    items: [
      { id: 'white-shirt', label: 'White Shirt', iconName: 'Shirt', correctZone: 0 },
      { id: 'black-pants', label: 'Black Pants', iconName: 'Scissors', correctZone: 1 },
      { id: 'yellow-socks', label: 'Yellow Socks', iconName: 'Star', correctZone: 0 },
      { id: 'dark-jacket', label: 'Dark Jacket', iconName: 'ShieldCheck', correctZone: 1 },
    ],
  },
  'grocery-shopping': {
    taskId: 'grocery-shopping',
    taskName: 'Grocery Shopping',
    colorBg: 'bg-pink-500',
    colorText: 'text-pink-600',
    voiceIntro: 'Let us sort the groceries! Put fruits in one basket and vegetables in the other.',
    zones: ['Fruits 🍎', 'Vegetables 🥦'],
    zoneEmojis: ['🍎', '🥦'],
    items: [
      { id: 'apple', label: 'Apple', iconName: 'Apple', correctZone: 0 },
      { id: 'carrot', label: 'Carrot', iconName: 'Carrot', correctZone: 1 },
      { id: 'banana', label: 'Banana', iconName: 'Cherry', correctZone: 0 },
      { id: 'broccoli', label: 'Broccoli', iconName: 'Leaf', correctZone: 1 },
    ],
  },
  'cafeteria-behavior': {
    taskId: 'cafeteria-behavior',
    taskName: 'Cafeteria Behavior',
    colorBg: 'bg-emerald-500',
    colorText: 'text-emerald-600',
    voiceIntro: 'Let us sort cafeteria actions! Which behaviors are good and which are not okay?',
    zones: ['Good ✅', 'Not Okay ❌'],
    zoneEmojis: ['✅', '❌'],
    items: [
      { id: 'say-please', label: 'Say Please', iconName: 'Heart', correctZone: 0 },
      { id: 'throw-food', label: 'Throw Food', iconName: 'Trash2', correctZone: 1 },
      { id: 'clean-tray', label: 'Clean Tray', iconName: 'Sparkles', correctZone: 0 },
      { id: 'shout', label: 'Shout Loudly', iconName: 'Volume2', correctZone: 1 },
    ],
  },
};
