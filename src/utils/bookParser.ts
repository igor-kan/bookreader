
import ePub from 'epubjs';
import * as PDFJS from 'pdfjs-dist';
import { Book } from 'epubjs';

export interface BookMetadata {
  title: string;
  author: string;
  publisher?: string;
  language?: string;
  cover?: string;
  description?: string;
}

// Get metadata from an EPUB book
export const getEpubMetadata = async (book: Book): Promise<BookMetadata> => {
  await book.ready;
  
  // Using any to bypass type checking since epubjs types are not complete
  const metadata = (book as any).metadata || {};
  
  return {
    title: metadata.title || 'Unknown Title',
    author: metadata.creator || 'Unknown Author',
    publisher: metadata.publisher,
    language: metadata.language,
    description: metadata.description,
    cover: (book as any).cover,
  };
};

// Get metadata from a PDF document
export const getPdfMetadata = async (pdf: any): Promise<BookMetadata> => {
  const metadata = await pdf.getMetadata().catch(() => ({}));
  const info = metadata.info || {};
  
  return {
    title: info.Title || 'Unknown Title',
    author: info.Author || 'Unknown Author',
    publisher: info.Producer,
    language: '',
    description: '',
  };
};

// Load an EPUB file
export const loadEpub = async (data: ArrayBuffer): Promise<Book> => {
  try {
    const book = ePub(data);
    await book.ready;
    return book;
  } catch (error) {
    console.error('Error loading EPUB:', error);
    throw new Error('Failed to load EPUB file');
  }
};

// Load a PDF file
export const loadPdf = async (data: ArrayBuffer): Promise<any> => {
  try {
    const loadingTask = PDFJS.getDocument({ data });
    return await loadingTask.promise;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw new Error('Failed to load PDF file');
  }
};

// Extract text from EPUB content and convert to rich HTML
export const extractRichTextFromEpub = (content: string): string => {
  // Preserve essential HTML formatting but sanitize it
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Remove stylesheets
    .replace(/on\w+="[^"]*"/g, '')                                     // Remove inline event handlers
    .trim();
};

// Extract text from EPUB content (plain text version)
export const extractTextFromEpub = (content: string): string => {
  // Simple HTML to text conversion
  return content
    .replace(/<[^>]*>/g, ' ') // Remove HTML tags
    .replace(/\s+/g, ' ')     // Collapse whitespace
    .trim();
};

// Extract text from PDF page
export const extractTextFromPdfPage = async (page: any): Promise<string> => {
  try {
    const textContent = await page.getTextContent();
    return textContent.items
      .map((item: any) => item.str)
      .join(' ');
  } catch (error) {
    console.error('Error extracting text from PDF page:', error);
    return '';
  }
};

// Convert PDF page to HTML representation
export const convertPdfPageToHtml = async (page: any): Promise<string> => {
  try {
    const textContent = await page.getTextContent();
    let lastY = -1;
    let html = '<div class="pdf-page">';
    
    // Group text by lines (items with similar y positions)
    textContent.items.forEach((item: any) => {
      const y = Math.round(item.transform[5]); // y-coordinate
      
      if (lastY !== -1 && Math.abs(y - lastY) > 3) {
        // New line detected
        html += '<br/>';
      }
      
      // Add text with appropriate styling
      html += `<span style="font-size: ${Math.abs(item.height)}px; 
                           font-family: ${item.fontName || 'sans-serif'};
                           position: relative;
                           left: ${Math.round(item.transform[4])}px;">
                ${item.str}
              </span>`;
      
      lastY = y;
    });
    
    html += '</div>';
    return html;
  } catch (error) {
    console.error('Error converting PDF page to HTML:', error);
    return '<div class="error">Failed to extract content</div>';
  }
};

// Helper to sanitize HTML
export const sanitizeHtml = (html: string): string => {
  // Simple sanitization to prevent XSS
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/g, '');
};
