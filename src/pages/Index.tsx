
import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import BookReader from '../components/BookReader';
import { Button } from '@/components/ui/button';
import { Book } from 'epubjs';

const Index = () => {
  const [book, setBook] = useState<Book | null>(null);
  const [bookType, setBookType] = useState<'epub' | 'pdf' | null>(null);
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleBookUploaded = (
    bookData: Book | ArrayBuffer | null,
    type: 'epub' | 'pdf'
  ) => {
    if (type === 'epub' && bookData instanceof Book) {
      setBook(bookData);
      setBookType('epub');
      setPdfData(null);
    } else if (type === 'pdf' && bookData instanceof ArrayBuffer) {
      setPdfData(bookData);
      setBookType('pdf');
      setBook(null);
    }
    setIsUploading(false);
  };

  const handleStartUpload = () => {
    setIsUploading(true);
  };

  const handleCancel = () => {
    setIsUploading(false);
  };

  const handleNewUpload = () => {
    setBook(null);
    setPdfData(null);
    setBookType(null);
  };

  return (
    <div className="min-h-screen bg-reader-background flex flex-col">
      <header className="sticky top-0 bg-white z-10 shadow-sm">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-reader-accent">EbookReader</h1>
          {(book || pdfData) && (
            <Button 
              variant="outline" 
              onClick={handleNewUpload}
              className="text-reader-accent border-reader-accent"
            >
              Upload New Book
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-8">
        {!book && !pdfData ? (
          <div className="flex flex-col items-center justify-center h-full">
            {isUploading ? (
              <FileUpload 
                onBookUploaded={handleBookUploaded} 
                onCancel={handleCancel} 
              />
            ) : (
              <div className="text-center max-w-md mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to EbookReader</h2>
                <p className="mb-8 text-gray-600">
                  Upload your e-book files (EPUB or PDF) to read them with enhanced features
                  like highlighting, note-taking and more.
                </p>
                <Button 
                  onClick={handleStartUpload} 
                  className="bg-reader-accent hover:bg-blue-600 text-white px-6 py-3"
                >
                  Upload an E-book
                </Button>
              </div>
            )}
          </div>
        ) : (
          <BookReader 
            book={book} 
            pdfData={pdfData} 
            bookType={bookType}
          />
        )}
      </main>
      
      <footer className="bg-white py-4 border-t">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} EbookReader - Read and interact with your e-books
        </div>
      </footer>
    </div>
  );
};

export default Index;
