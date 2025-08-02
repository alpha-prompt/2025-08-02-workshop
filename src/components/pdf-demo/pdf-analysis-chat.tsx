import { useThreadRuntime } from "@assistant-ui/react";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PDFThread } from "@/components/assistant-ui/pdf-thread";

interface PDFAnalysisChatProps {
  file: File;
  fileName: string;
  analysisPrompt: string;
  outputFormat: "excel" | "markdown";
  onReset: () => void;
}

export function PDFAnalysisChat({
  file,
  fileName,
  analysisPrompt,
  outputFormat,
  onReset,
}: PDFAnalysisChatProps) {
  const thread = useThreadRuntime();

  useEffect(() => {
    if (analysisPrompt.trim()) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result !== "string") {
          toast.error("File reading failed", {
            description: "Could not read the PDF file data",
          });
          return;
        }

        thread.append({
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt,
            },
            {
              type: "file",
              data: result,
              mimeType: file.type,
            },
          ],
        });
      };

      fileReader.onerror = () => {
        toast.error("File reading failed", {
          description: "Could not read the PDF file",
        });
      };

      fileReader.readAsDataURL(file);

      // Cleanup function to abort FileReader if component unmounts or dependencies change
      return () => {
        if (fileReader.readyState === FileReader.LOADING) {
          fileReader.abort();
        }
      };
    }
  }, [analysisPrompt, file, thread]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="size-5" />
          <span className="font-medium">Analyzing: {fileName}</span>
        </div>
        <Button variant="outline" size="sm" onClick={onReset}>
          Upload New PDF
        </Button>
      </div>

      <div className="border rounded-lg" style={{ height: "600px" }}>
        <PDFThread
          fileName={fileName}
          outputFormat={outputFormat}
          onReset={onReset}
        />
      </div>
    </div>
  );
}