
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from 'epubjs';
import ePub from 'epubjs';
import { toast } from 'sonner';

interface FileUploadProps {
  onBookUploaded: (book: Book | ArrayBuffer | null, type: 'epub' | 'pdf') => void;
  onCancel: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onBookUploaded, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setIsLoading(true);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'epub') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const book = ePub(arrayBuffer);
        await book.ready;
        onBookUploaded(book, 'epub');
        toast.success('EPUB book loaded successfully');
      } catch (error) {
        console.error('Error loading EPUB:', error);
        toast.error('Failed to load EPUB book. Please try a different file.');
        setIsLoading(false);
      }
    } else if (fileExtension === 'pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        onBookUploaded(arrayBuffer, 'pdf');
        toast.success('PDF loaded successfully');
      } catch (error) {
        console.error('Error loading PDF:', error);
        toast.error('Failed to load PDF. Please try a different file.');
        setIsLoading(false);
      }
    } else {
      toast.error('Unsupported file format. Please upload an EPUB or PDF file.');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload your e-book</h2>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
            isDragging ? 'border-reader-accent bg-blue-50' : 'border-gray-300'
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-8 h-8 border-4 border-reader-accent border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-gray-500">Loading your book...</p>
            </div>
          ) : (
            <>
              <div className="text-reader-accent mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-gray-400 text-sm">Supports EPUB and PDF formats</p>
            </>
          )}
          <input
            id="file-upload"
            type="file"
            accept=".epub,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onCancel} className="mr-2">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
