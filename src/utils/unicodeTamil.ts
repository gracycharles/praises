import { ExtractionValidation } from '../types';

/**
 * Normalizes Tamil text using Unicode Normalization Form C (NFC)
 * to ensure all Tamil pulli, diacritics, and uyirmei characters
 * are represented cleanly without orphan diacritic codes.
 */
export function normalizeTamilNFC(text: string): string {
  if (!text) return '';
  return text.normalize('NFC');
}

/**
 * Checks if a character is within the Tamil Unicode Block (U+0B80 to U+0BFF)
 */
export function isTamilChar(char: string): boolean {
  if (!char) return false;
  const code = char.charCodeAt(0);
  return code >= 0x0b80 && code <= 0x0bff;
}

/**
 * Validates text for Tamil PDF extraction losslessness & quality metrics
 */
export function validateTamilExtraction(rawText: string, pageCount: number = 1): ExtractionValidation {
  const normalized = normalizeTamilNFC(rawText);
  const totalCharacters = normalized.length;
  
  let tamilCount = 0;
  for (let i = 0; i < totalCharacters; i++) {
    if (isTamilChar(normalized[i])) {
      tamilCount++;
    }
  }

  const tamilPercentage = totalCharacters > 0 ? (tamilCount / totalCharacters) * 100 : 0;

  // Detect potential hyphen splits at line breaks (e.g. ஸ்தோத்-\nதிரம்)
  const hyphenMatches = normalized.match(/[\u0B80-\u0BFF]+-\s*[\u0B80-\u0BFF]+/g) || [];

  return {
    pageCount,
    totalCharacters,
    tamilCharacterCount: tamilCount,
    tamilPercentage: Math.round(tamilPercentage * 10) / 10,
    isNormalizedNFC: rawText === normalized,
    suspectedHyphenatedWords: hyphenMatches,
    unicodeRangeValid: tamilCount > 0,
    issuesCount: hyphenMatches.length + (tamilPercentage < 40 ? 1 : 0)
  };
}

/**
 * Rejoins hyphenated Tamil words broken across line wraps
 */
export function repairHyphenatedTamil(text: string): string {
  return text.replace(/([\u0B80-\u0BFF]+)-\s*[\n\r]+\s*([\u0B80-\u0BFF]+)/g, '$1$2');
}

/**
 * Cleans extra whitespace while preserving paragraph breaks
 */
export function sanitizeParagraphs(text: string): string[] {
  const norm = normalizeTamilNFC(text);
  return norm
    .split(/\n{2,}|\r\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
}
