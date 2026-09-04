export interface AvatarOption {
  id: string;
  name: string;
  category: 'ANIMALS' | 'BOYS' | 'GIRLS';
  url: string;
}

export const DISCORD_AVATAR_PRESETS: AvatarOption[] = [
  // DOGS & ANIMALS
  {
    id: 'dog-shiba',
    name: 'Cyber Shiba Pup',
    category: 'ANIMALS',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CyberDoggo&backgroundColor=b6e3f4&radius=50',
  },
  {
    id: 'dog-golden',
    name: 'Happy Golden Dog',
    category: 'ANIMALS',
    url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=HappyDoggie&backgroundColor=ffd5dc&radius=50',
  },
  {
    id: 'cat-ninja',
    name: 'Ninja Cat Astro',
    category: 'ANIMALS',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=NinjaKitten&backgroundColor=c0aede&radius=50',
  },
  {
    id: 'fox-cyber',
    name: 'Cyber Fox Scout',
    category: 'ANIMALS',
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PixelFox&backgroundColor=ffdfbf&radius=50',
  },

  // BOYS
  {
    id: 'boy-gamer',
    name: 'Gamer Boy Alex',
    category: 'BOYS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LeoGamer&backgroundColor=b6e3f4&radius=50',
  },
  {
    id: 'boy-tech',
    name: 'Tech Coder Felix',
    category: 'BOYS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=FelixBoy&backgroundColor=d1d4f9&radius=50',
  },
  {
    id: 'boy-anime',
    name: 'Anime Hero Kai',
    category: 'BOYS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=KaiHero&backgroundColor=c0aede&radius=50',
  },

  // GIRLS
  {
    id: 'girl-cyber',
    name: 'Cyber Girl Zara',
    category: 'GIRLS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=ZaraAnime&backgroundColor=ffd5dc&radius=50',
  },
  {
    id: 'girl-artist',
    name: 'Artist Girl Luna',
    category: 'GIRLS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=LunaGirl&backgroundColor=ffdfbf&radius=50',
  },
  {
    id: 'girl-tech',
    name: 'Data Scientist Maya',
    category: 'GIRLS',
    url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=MayaScientist&backgroundColor=b6e3f4&radius=50',
  },
];

export const DEFAULT_AVATAR = DISCORD_AVATAR_PRESETS[0].url;
