
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker (this is critical to make PDF.js work)
const pdfjsVersion = pdfjsLib.version;
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsVersion}/pdf.worker.min.js`;

type FileUploaderProps = {
  onTextExtracted: (text: string) => void;
};

const FileUploader = ({ onTextExtracted }: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Verify the libraries are loaded properly
  useEffect(() => {
    console.log("PDF.js version:", pdfjsLib.version);
    console.log("Libraries loaded successfully");
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);
    setProgress(0);

    try {
      // For text files
      if (file.type === "text/plain") {
        const text = await readTextFile(file);
        onTextExtracted(text);
        toast.success("Text file processed successfully");
      } 
      // For PDFs
      else if (file.type === "application/pdf") {
        setProgress(10);
        const text = await extractTextFromPdf(file);
        setProgress(100);
        onTextExtracted(text);
        toast.success("PDF processed successfully");
      } else {
        toast.error("Only text and PDF files are supported");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const readTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsText(file);
    });
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        // Read the file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        setProgress(20);
        
        const pdf = await loadingTask.promise;
        setProgress(40);
        
        let fullText = "";
        
        // Get total number of pages
        const numPages = pdf.numPages;
        
        // Extract text from each page
        for (let i = 1; i <= numPages; i++) {
          setProgress(40 + Math.floor((i / numPages) * 50));
          
          // Get the page
          const page = await pdf.getPage(i);
          
          // Extract text content
          const textContent = await page.getTextContent();
          
          // Join all the text items
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          
          fullText += pageText + "\n\n";
        }
        
        resolve(fullText.trim());
      } catch (error) {
        console.error("Error extracting text from PDF:", error);
        reject(new Error("Failed to extract text from PDF"));
      }
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload a file to generate flashcards
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: .txt, .pdf
            </p>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".txt,.pdf"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <label htmlFor="file-upload">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isLoading}
                  asChild
                >
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    {isLoading ? "Processing..." : "Upload File"}
                  </span>
                </Button>
              </label>
            </div>
            {fileName && (
              <div className="mt-4 w-full max-w-xs">
                <p className="text-sm font-medium mb-2">
                  {isLoading ? "Processing " : "Processed "} {fileName}
                </p>
                {isLoading && progress > 0 && (
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-primary h-full transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
