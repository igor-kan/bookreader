
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface TocItem {
  href: string;
  label: string;
  subitems?: TocItem[];
}

interface TableOfContentsProps {
  items: TocItem[];
  onNavigate: (href: string) => void;
  bookType: 'epub' | 'pdf' | null;
  pdfNumPages: number;
  onNavigatePdf: (pageNum: number) => void;
  onClose: () => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  items, 
  onNavigate, 
  bookType, 
  pdfNumPages, 
  onNavigatePdf,
  onClose
}) => {
  const generatePageNumbers = (totalPages: number) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Table of Contents</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="overflow-auto max-h-[calc(100%-4rem)]">
        {bookType === 'epub' && items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index}>
                <Button 
                  variant="ghost" 
                  className="text-left w-full justify-start font-normal text-sm hover:text-reader-accent"
                  onClick={() => onNavigate(item.href)}
                >
                  {item.label}
                </Button>
                {item.subitems && item.subitems.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {item.subitems.map((subitem, subIndex) => (
                      <li key={subIndex}>
                        <Button 
                          variant="ghost" 
                          className="text-left w-full justify-start font-normal text-xs hover:text-reader-accent"
                          onClick={() => onNavigate(subitem.href)}
                        >
                          {subitem.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : bookType === 'pdf' ? (
          <ul className="space-y-1">
            {generatePageNumbers(pdfNumPages).map((pageNum) => (
              <li key={pageNum}>
                <Button 
                  variant="ghost" 
                  className="text-left w-full justify-start font-normal text-sm hover:text-reader-accent"
                  onClick={() => onNavigatePdf(pageNum)}
                >
                  Page {pageNum}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">No content available</p>
        )}
      </div>
    </div>
  );
};

export default TableOfContents;
