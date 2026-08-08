export interface PraiseItem {
  id: number;
  text: string;
  reference: string;
  page: number;
  category?: string;
  notes?: string;
}

export interface PageData {
  page: number;
  title?: string;
  rawText: string;
  praises: PraiseItem[];
}

export interface BookMetadata {
  title: string;
  subtitle: string;
  author: string;
  organization: string;
  address: string;
  phone: string;
  scriptureVerses: string[];
  foreword: {
    title: string;
    content: string;
    author: string;
  };
}

export interface AudioVoice {
  id: string;
  name: string;
  lang: string;
  gender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  type: 'Wavenet' | 'Neural2' | 'Studio' | 'Browser';
}

export interface PlayerSettings {
  voice: string;
  speed: number;
  pitch: number;
  autoScroll: boolean;
  continuousPlay: boolean;
  gaplessMode: boolean;
  volume: number;
  useBrowserFallback: boolean;
}

export interface ExtractionValidation {
  pageCount: number;
  totalCharacters: number;
  tamilCharacterCount: number;
  tamilPercentage: number;
  isNormalizedNFC: boolean;
  suspectedHyphenatedWords: string[];
  unicodeRangeValid: boolean;
  issuesCount: number;
}
