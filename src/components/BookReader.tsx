
import { useEffect, useRef, useState } from 'react';
import { Book, Rendition } from 'epubjs';
import * as PDFJS from 'pdfjs-dist';
import ReaderControls from './ReaderControls';
import TableOfContents from './TableOfContents';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TocItem } from './TableOfContents';
import { extractRichTextFromEpub, convertPdfPageToHtml, sanitizeHtml } from '@/utils/bookParser';

// Set up the PDF.js worker
const pdfWorkerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS.version}/build/pdf.worker.min.js`;
PDFJS.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

interface BookReaderProps {
  book: Book | null;
  pdfData: ArrayBuffer | null;
  bookType: 'epub' | 'pdf' | null;
}

interface Highlight {
  cfi: string;
  text: string;
}

const BookReader: React.FC<BookReaderProps> = ({ book, pdfData, bookType }) => {
  const readerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [rendition, setRendition] = useState<Rendition | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [totalLocations, setTotalLocations] = useState<number>(0);
  const [currentCfi, setCurrentCfi] = useState<string>('');
  const [tableOfContents, setTableOfContents] = useState<TocItem[]>([]);
  const [pdfDocument, setPdfDocument] = useState<any>(null);
  const [pdfPageNum, setPdfPageNum] = useState<number>(1);
  const [pdfNumPages, setPdfNumPages] = useState<number>(0);
  const [showToc, setShowToc] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(100);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReaderReady, setIsReaderReady] = useState<boolean>(false);
  const [richContent, setRichContent] = useState<string>('');
  const [useRichText, setUseRichText] = useState<boolean>(true);

  // EPUB book initialization
  useEffect(() => {
    if (bookType === 'epub' && book && readerRef.current) {
      // Clear any previous content
      readerRef.current.innerHTML = '';
      
      if (useRichText) {
        // Use rich text rendering approach
        book.ready.then(() => {
          // Load book spine items
          const spine = book.spine;
          if (spine) {
            book.loaded.navigation.then(nav => {
              setTableOfContents(nav.toc);
            });
            
            // Get current spine item
            const spineItem = spine.get();
            
            // Use promise-based approach to handle document loading
            spineItem.load().then((doc: any) => {
              // Convert to HTML string
              let html = '';
              if (doc && doc.documentElement) {
                html = doc.documentElement.outerHTML;
              }
              
              // Process and display HTML
              const processedHtml = extractRichTextFromEpub(html);
              setRichContent(processedHtml);
              
              // Setup scrolling progress tracking
              setTotalLocations(100); // Using percentage for rich text mode
              setCurrentLocation('0');
              setIsReaderReady(true);
            }).catch((error: Error) => {
              console.error('Error loading spine item:', error);
              toast.error('Failed to load book content');
            });
          }
        });
      } else {
        // Initialize EPUB rendition (standard approach)
        const rendition = book.renderTo(readerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'paginated'
        });

        rendition.display();
        setRendition(rendition);
        
        // Load table of contents
        book.ready.then(() => {
          book.loaded.navigation.then(nav => {
            setTableOfContents(nav.toc);
          });
          
          // Generate locations with a valid spine argument
          book.locations.generate(1024).then(() => {
            // Use any to bypass type checking since epubjs types are not complete
            const locationsCount = (book.locations as any).total || 0;
            setTotalLocations(locationsCount);
            setIsReaderReady(true);
          }).catch(err => console.error('Error generating locations:', err));
        });

        // Listen for location changes
        rendition.on('relocated', (location: any) => {
          setCurrentLocation(location.start.cfi);
          setCurrentCfi(location.start.cfi);
        });

        // Setup highlight handling
        rendition.on('selected', (cfiRange: string, contents: any) => {
          const selection = contents.window.getSelection();
          if (selection && selection.toString().trim().length > 0) {
            const text = selection.toString();
            
            // Add highlight
            rendition.annotations.highlight(cfiRange, {}, (e: Event) => {
              console.log('Highlight clicked:', cfiRange);
            });

            // Save highlight to state
            setHighlights(prev => [...prev, { cfi: cfiRange, text }]);
            toast.success('Text highlighted');
          }
        });
      }

      return () => {
        // Cleanup
        if (book) {
          book.destroy();
        }
      };
    }
  }, [book, bookType, useRichText]);

  // Setup rich text highlighting
  useEffect(() => {
    if (bookType === 'epub' && useRichText && contentRef.current) {
      const contentElement = contentRef.current;
      
      // Setup event listener for selection
      const handleSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
          const range = selection.getRangeAt(0);
          const text = selection.toString();
          
          // Create unique identifier for this highlight
          const highlightId = `highlight-${new Date().getTime()}`;
          
          // Create highlight span
          const highlightSpan = document.createElement('span');
          highlightSpan.className = 'highlighted-text';
          highlightSpan.id = highlightId;
          highlightSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
          highlightSpan.style.cursor = 'pointer';
          
          try {
            // Surround the selected text with the highlight span
            range.surroundContents(highlightSpan);
            
            // Add event listener to the highlight span
            highlightSpan.addEventListener('click', () => {
              console.log('Highlight clicked:', text);
            });
            
            // Save highlight to state
            setHighlights(prev => [...prev, { cfi: highlightId, text }]);
            
            // Clear selection after highlighting
            selection.removeAllRanges();
            
            toast.success('Text highlighted');
          } catch (e) {
            console.error('Error creating highlight:', e);
            toast.error('Could not create highlight. Try selecting a smaller portion of text.');
          }
        }
      };
      
      // Add double-click event to create highlights
      contentElement.addEventListener('dblclick', handleSelection);
      
      return () => {
        // Cleanup event listener
        contentElement.removeEventListener('dblclick', handleSelection);
      };
    }
  }, [richContent, useRichText, bookType]);

  // PDF initialization
  useEffect(() => {
    if (bookType === 'pdf' && pdfData) {
      const loadPdf = async () => {
        try {
          const loadingTask = PDFJS.getDocument({ data: pdfData });
          const pdf = await loadingTask.promise;
          setPdfDocument(pdf);
          setPdfNumPages(pdf.numPages);
          setIsReaderReady(true);
          
          if (useRichText && contentRef.current) {
            // Render PDF in rich text mode
            await renderPdfPageAsHtml(pdf, 1);
          } else if (canvasRef.current) {
            // Render PDF in canvas mode
            await renderPdfPage(pdf, 1);
          }
        } catch (error) {
          console.error('Error loading PDF:', error);
          toast.error('Failed to render PDF document');
        }
      };
      
      loadPdf();
      
      return () => {
        // Cleanup PDF
        if (pdfDocument) {
          pdfDocument.destroy();
        }
      };
    }
  }, [pdfData, bookType, useRichText]);

  // Render PDF page as HTML
  const renderPdfPageAsHtml = async (pdf: any, pageNumber: number) => {
    if (!contentRef.current) return;
    
    try {
      const page = await pdf.getPage(pageNumber);
      const htmlContent = await convertPdfPageToHtml(page);
      
      contentRef.current.innerHTML = sanitizeHtml(htmlContent);
      setPdfPageNum(pageNumber);
    } catch (error) {
      console.error('Error rendering PDF page as HTML:', error);
      toast.error('Failed to render page content');
    }
  };

  // Render PDF page on canvas
  const renderPdfPage = async (pdf: any, pageNumber: number) => {
    if (!canvasRef.current) return;
    
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) return;
      
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      setPdfPageNum(pageNumber);
    } catch (error) {
      console.error('Error rendering PDF page:', error);
      toast.error('Failed to render page');
    }
  };

  // Navigation handlers
  const nextPage = () => {
    if (bookType === 'epub' && rendition && !useRichText) {
      rendition.next();
    } else if (bookType === 'pdf' && pdfDocument && pdfPageNum < pdfNumPages) {
      if (useRichText) {
        renderPdfPageAsHtml(pdfDocument, pdfPageNum + 1);
      } else {
        renderPdfPage(pdfDocument, pdfPageNum + 1);
      }
    }
  };

  const prevPage = () => {
    if (bookType === 'epub' && rendition && !useRichText) {
      rendition.prev();
    } else if (bookType === 'pdf' && pdfDocument && pdfPageNum > 1) {
      if (useRichText) {
        renderPdfPageAsHtml(pdfDocument, pdfPageNum - 1);
      } else {
        renderPdfPage(pdfDocument, pdfPageNum - 1);
      }
    }
  };

  const navigateTo = (href: string) => {
    if (bookType === 'epub') {
      if (rendition && !useRichText) {
        rendition.display(href);
      }
      setShowToc(false);
    }
  };

  const navigateToPdfPage = (pageNum: number) => {
    if (bookType === 'pdf' && pdfDocument && pageNum >= 1 && pageNum <= pdfNumPages) {
      if (useRichText) {
        renderPdfPageAsHtml(pdfDocument, pageNum);
      } else {
        renderPdfPage(pdfDocument, pageNum);
      }
    }
  };

  const changeFontSize = (size: number) => {
    setFontSize(size);
    if (contentRef.current && useRichText) {
      contentRef.current.style.fontSize = `${size}%`;
    } else if (bookType === 'epub' && rendition && !useRichText) {
      rendition.themes.fontSize(`${size}%`);
    }
  };

  // Toggle between rich text and standard rendering
  const toggleRenderMode = () => {
    setUseRichText(!useRichText);
  };

  if (!isReaderReady) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-12 h-12 border-4 border-reader-accent border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading your book...</span>
      </div>
    );
  }

  return (
    <div className="flex h-[80vh] relative">
      {/* Table of Contents Sidebar */}
      <div 
        className={cn(
          "absolute left-0 top-0 h-full bg-white z-10 shadow-lg transition-transform transform lg:static lg:block lg:w-64 overflow-auto",
          showToc ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <TableOfContents 
          items={tableOfContents} 
          onNavigate={navigateTo}
          bookType={bookType}
          pdfNumPages={pdfNumPages}
          onNavigatePdf={navigateToPdfPage}
          onClose={() => setShowToc(false)}
        />
      </div>

      {/* Main Reading Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Reader Controls */}
        <ReaderControls
          onPrev={prevPage}
          onNext={nextPage}
          onToggleToc={() => setShowToc(!showToc)}
          currentLocation={bookType === 'epub' ? currentLocation : `${pdfPageNum}`}
          totalLocations={bookType === 'epub' ? totalLocations : pdfNumPages}
          fontSize={fontSize}
          onChangeFontSize={changeFontSize}
          bookType={bookType}
        />
        
        {/* Mode toggle button */}
        <div className="bg-white border-b px-3 py-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={toggleRenderMode}
            className="text-xs"
          >
            {useRichText ? "Switch to Standard View" : "Switch to Rich Text View"}
          </Button>
        </div>
        
        {/* Content Display Area */}
        <div className="flex-1 overflow-auto bg-reader-background">
          <Tabs defaultValue="reading" className="w-full">
            <TabsList className="w-full bg-white border-b">
              <TabsTrigger value="reading" className="flex-1">Reading</TabsTrigger>
              <TabsTrigger value="highlights" className="flex-1">Highlights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reading" className="p-0 h-full">
              <div className="h-full flex items-center justify-center">
                {useRichText ? (
                  <div 
                    ref={contentRef}
                    className="w-full h-full max-w-3xl mx-auto p-6 bg-white shadow-lg overflow-auto rich-text-content"
                    style={{ fontSize: `${fontSize}%` }}
                    dangerouslySetInnerHTML={{ __html: richContent }}
                  />
                ) : bookType === 'epub' ? (
                  <div 
                    ref={readerRef} 
                    className="w-full h-full max-w-3xl mx-auto shadow-lg bg-white"
                  />
                ) : (
                  <div className="w-full h-full overflow-auto flex justify-center p-4">
                    <canvas ref={canvasRef} />
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="highlights" className="p-4">
              <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Your Highlights</h3>
                {highlights.length > 0 ? (
                  <div className="space-y-4">
                    {highlights.map((highlight, index) => (
                      <div 
                        key={index} 
                        className="p-3 bg-reader-muted rounded-md border-l-4 border-reader-accent"
                      >
                        <p>"{highlight.text}"</p>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              if (useRichText && highlight.cfi.startsWith('highlight-')) {
                                const element = document.getElementById(highlight.cfi);
                                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              } else if (bookType === 'epub' && rendition) {
                                rendition.display(highlight.cfi);
                              }
                            }}
                          >
                            Go to highlight
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    {useRichText ? 
                      "No highlights yet. Double-click on text while reading to highlight it." : 
                      "No highlights yet. Select text while reading to highlight it."}
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
