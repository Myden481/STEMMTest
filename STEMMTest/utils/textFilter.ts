

import { CensorType, Profanity } from '@2toad/profanity';

const profanity = new Profanity({
  languages: ['en'],
  grawlix: '@#$%&!',
  grawlixChar: '*',
  wholeWord: false,
});

profanity.addWords(['stupid']);

export interface FilterResult {
  clean: string;
  hasProfanity: boolean;
}

export function filterText(input: string): FilterResult {
  const hasProfanity = profanity.exists(input);
  return {
    clean: hasProfanity ? profanity.censor(input, CensorType.AllVowels) : input,
    hasProfanity,
  };
}

export function isProfane(input: string): boolean {
  return profanity.exists(input);
}
