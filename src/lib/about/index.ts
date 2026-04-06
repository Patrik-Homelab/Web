import czechAboutStory from './czech';
import englishAboutStory from './english';

export const aboutStories = {
  en: englishAboutStory,
  cs: czechAboutStory
} as const;

export type AboutStoryLanguage = keyof typeof aboutStories;
