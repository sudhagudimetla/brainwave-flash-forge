
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";

type FileUploaderProps = {
  onTextExtracted: (text: string) => void;
};

const FileUploader = ({ onTextExtracted }: FileUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setFileName(file.name);

    try {
      // For text files
      if (file.type === "text/plain") {
        const text = await readTextFile(file);
        onTextExtracted(text);
        toast.success("Text file processed successfully");
      } 
      // For PDFs we would integrate with a PDF extraction library
      // This is a simplified version that just reads text files for now
      else if (file.type === "application/pdf") {
        toast.error("PDF processing will be available soon!");
        // In a real implementation, we would use a PDF extraction library
        // const text = await extractTextFromPdf(file);
        // onTextExtracted(text);
      } else {
        toast.error("Only text and PDF files are supported");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process file");
    } finally {
      setIsLoading(false);
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

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 rounded-lg p-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload a text file to generate flashcards
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supported formats: .txt (PDF coming soon)
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
              <p className="text-sm font-medium mt-4">
                {isLoading ? "Processing " : "Processed "} {fileName}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
