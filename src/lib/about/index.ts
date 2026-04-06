import englishAboutStory from './english';
import czechAboutStory from './czech';

export const aboutStories = {
  en: englishAboutStory,
  cs: czechAboutStory
} as const;

export type AboutStoryLanguage = keyof typeof aboutStories;
