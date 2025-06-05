
export interface Highlight {
  id: string;
  cfi: string;
  text: string;
  color: string;
  note?: string;
  createdAt: number;
}

export const saveHighlight = (bookId: string, highlight: Highlight): void => {
  try {
    // Get existing highlights from localStorage
    const highlightsJson = localStorage.getItem(`highlights-${bookId}`);
    const highlights: Highlight[] = highlightsJson ? JSON.parse(highlightsJson) : [];
    
    // Add new highlight
    highlights.push(highlight);
    
    // Save back to localStorage
    localStorage.setItem(`highlights-${bookId}`, JSON.stringify(highlights));
  } catch (error) {
    console.error('Error saving highlight:', error);
  }
};

export const getHighlights = (bookId: string): Highlight[] => {
  try {
    const highlightsJson = localStorage.getItem(`highlights-${bookId}`);
    return highlightsJson ? JSON.parse(highlightsJson) : [];
  } catch (error) {
    console.error('Error getting highlights:', error);
    return [];
  }
};

export const updateHighlight = (bookId: string, highlightId: string, updates: Partial<Highlight>): void => {
  try {
    const highlights = getHighlights(bookId);
    const index = highlights.findIndex(h => h.id === highlightId);
    
    if (index >= 0) {
      highlights[index] = { ...highlights[index], ...updates };
      localStorage.setItem(`highlights-${bookId}`, JSON.stringify(highlights));
    }
  } catch (error) {
    console.error('Error updating highlight:', error);
  }
};

export const removeHighlight = (bookId: string, highlightId: string): void => {
  try {
    const highlights = getHighlights(bookId);
    const filteredHighlights = highlights.filter(h => h.id !== highlightId);
    localStorage.setItem(`highlights-${bookId}`, JSON.stringify(filteredHighlights));
  } catch (error) {
    console.error('Error removing highlight:', error);
  }
};

export const generateHighlightId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
