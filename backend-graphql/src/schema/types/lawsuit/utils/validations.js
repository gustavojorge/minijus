/**
 * Validates if a string matches CNJ pattern
 * Uses the same pattern as searcher: r"^\d{2,7}[\-_]?\d{2}[\._]?\d{4}[\._]?\d{1}[\._]?\d{2}[\._]?\d{4}$"
 */
export function isValidCNJ(query) {
  if (!query || typeof query !== 'string') {
    return false;
  }
  
  // CNJ pattern: allows various separators and formats
  const cnjPattern = /^\d{2,7}[\-_]?\d{2}[\._]?\d{4}[\._]?\d{1}[\._]?\d{2}[\._]?\d{4}$/;
  return cnjPattern.test(query.trim());
}

