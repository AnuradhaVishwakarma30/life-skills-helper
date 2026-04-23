import { SortingConfig } from '../components/games/SortingZoneGame';

export const sortingConfigs: Record<string, SortingConfig> = {
  'laundry-sorting': {
    taskId: 'laundry-sorting',
    taskName: 'Laundry Sorting',
    colorBg: 'bg-violet-500',
    colorText: 'text-violet-600',
    voiceIntro: 'Time to sort the laundry! Put light clothes in one pile and dark clothes in the other.',
    zones: ['Lights ☀️', 'Darks 🌙'],
    zoneEmojis: ['☀️', '🌙'],
    items: [
      { id: 'white-shirt', label: 'White Shirt', iconName: 'Shirt', correctZone: 0, iconColor: 'text-gray-300', imageUrl: 'https://i.postimg.cc/vHr8tk3y/white-shirt.jpg' },
      { id: 'black-pants', label: 'Black Pants', iconName: 'Shirt', correctZone: 1, iconColor: 'text-gray-800', imageUrl: 'https://i.postimg.cc/BvdRyQng/images.jpg' },
      { id: 'yellow-socks', label: 'Yellow Socks', iconName: 'Star', correctZone: 0, iconColor: 'text-yellow-400', imageUrl: 'https://i.postimg.cc/zfRcnZFF/ab38c2ed35cdf2cfe7b96e8ade1ca24b-t.jpg' },
      { id: 'dark-jacket', label: 'Dark Jacket', iconName: 'Shirt', correctZone: 1, iconColor: 'text-indigo-800', imageUrl: 'https://i.postimg.cc/Zq3wWPJ7/black-jack.png' },
      { id: 'pink-dress', label: 'Pink Dress', iconName: 'Shirt', correctZone: 0, iconColor: 'text-pink-400', imageUrl: 'https://i.postimg.cc/s2FcCB5S/pink-dress.png' },
      { id: 'navy-sweater', label: 'Navy Sweater', iconName: 'Shirt', correctZone: 1, iconColor: 'text-blue-900', imageUrl: 'https://i.postimg.cc/DfY1KJTk/images-(1).jpg' },
    ],
  },
  'getting-dressed': {
    taskId: 'getting-dressed',
    taskName: 'Getting Dressed',
    colorBg: 'bg-orange-500',
    colorText: 'text-orange-600',
    voiceIntro: 'Look at the weather and pick the right clothes!',
    zones: ['Rainy Day 🌧️', 'Sunny Day ☀️'],
    zoneEmojis: ['🌧️', '☀️'],
    items: [
      { id: 'umbrella', label: 'Umbrella', iconName: 'Umbrella', correctZone: 0, iconColor: 'text-blue-500', imageUrl: 'https://i.postimg.cc/HxwkxNJV/umbrella.jpg' },
      { id: 'raincoat', label: 'Raincoat', iconName: 'Shirt', correctZone: 0, iconColor: 'text-yellow-500', imageUrl: 'https://i.postimg.cc/W335pBY7/raincoat.jpg' },
      { id: 'sunglasses', label: 'Sunglasses', iconName: 'Glasses', correctZone: 1, iconColor: 'text-amber-600', imageUrl: 'https://i.postimg.cc/Dw6D2Pyd/sungkas.jpg' },
      { id: 'rain-boots', label: 'Rain Boots', iconName: 'Footprints', correctZone: 0, iconColor: 'text-green-600', imageUrl: 'https://i.postimg.cc/PJnKbCr9/rainboot.jpg' },
      { id: 'sun-hat', label: 'Sun Hat', iconName: 'Sun', correctZone: 1, iconColor: 'text-orange-400', imageUrl: 'https://i.postimg.cc/Fs9V95fJ/hat.jpg' },
      { id: 'shorts', label: 'Shorts', iconName: 'Shirt', correctZone: 1, iconColor: 'text-sky-400', imageUrl: 'https://i.postimg.cc/TY4LBZnv/shorts.jpg' },
    ],
  },
  'grocery-shopping': {
    taskId: 'grocery-shopping',
    taskName: 'Grocery Shopping',
    colorBg: 'bg-pink-500',
    colorText: 'text-pink-600',
    voiceIntro: 'Let us put the groceries in the right place! Cold items go in the fridge, dry items go on the shelf.',
    zones: ['Fridge 🧊', 'Shelf 📦'],
    zoneEmojis: ['🧊', '📦'],
    items: [
      { id: 'milk', label: 'Milk', iconName: 'Milk', correctZone: 0, iconColor: 'text-blue-200', imageUrl: 'https://i.postimg.cc/4yM8KWHc/milk.jpg' },
      { id: 'cheese', label: 'Cheese', iconName: 'Triangle', correctZone: 0, iconColor: 'text-yellow-400', imageUrl: 'https://i.postimg.cc/4d0vwm4x/amul-chees.jpg' },
      { id: 'cereal', label: 'Cereal', iconName: 'Wheat', correctZone: 1, iconColor: 'text-amber-600', imageUrl: 'https://i.postimg.cc/2jB9Mfs7/cerel.jpg' },
      { id: 'juice', label: 'Juice', iconName: 'CupSoda', correctZone: 0, iconColor: 'text-orange-400', imageUrl: 'https://i.postimg.cc/sx9YzK9j/juice.jpg' },
      { id: 'rice', label: 'Rice', iconName: 'Package', correctZone: 1, iconColor: 'text-amber-100', imageUrl: 'https://i.postimg.cc/3NBvVNY0/rice.jpg' },
      { id: 'cookies', label: 'Cookies', iconName: 'Cookie', correctZone: 1, iconColor: 'text-amber-700', imageUrl: 'https://i.postimg.cc/SNRRkDGd/biscuit.jpg' },
    ],
  },
};

};
