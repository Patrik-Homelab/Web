export type StoryObjectKind = 'sun' | 'planet' | 'moon';

export type StoryVisualTheme =
  | 'sun'
  | 'mercury'
  | 'venus'
  | 'earth'
  | 'moon'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune';

export type StoryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type StoryEntry = {
  id: string;
  parentId?: string;
  kind: StoryObjectKind;
  title: string;
  subtitle: string;
  preview: string;
  full: string;
  images?: StoryImage[];
  visual: {
    orbit: number;
    period: number;
    size: number;
    startAngle: number;
    theme: StoryVisualTheme;
  };
};

export type AboutStory = {
  title: string;
  subtitle: string;
  hint: string;
  entries: StoryEntry[];
};
