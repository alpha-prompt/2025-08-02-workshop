import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { PDF_MAX_SIZE_BYTES, PDF_MAX_SIZE_MB } from "@/constants/pdf-demo";

interface FileUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileUploadSection({
  files,
  onFilesChange,
}: FileUploadSectionProps) {
  const onFileValidate = useCallback((file: File): string | null => {
    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      return "Only PDF files are allowed";
    }

    // Validate file size
    if (file.size > PDF_MAX_SIZE_BYTES) {
      return `File size must be less than ${PDF_MAX_SIZE_MB}MB`;
    }

    return null;
  }, []);

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" was rejected`,
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload PDF Document</CardTitle>
        <CardDescription>
          Upload a strategy memo or investment document (max {PDF_MAX_SIZE_MB}MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          value={files}
          onValueChange={onFilesChange}
          onFileValidate={onFileValidate}
          onFileReject={onFileReject}
          accept="application/pdf"
          maxFiles={1}
          className="w-full"
        >
          <FileUploadDropzone>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center rounded-full border p-3">
                <Upload className="size-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">Drop your PDF here</p>
                <p className="text-muted-foreground text-xs">
                  Or click to browse (PDF only, max {PDF_MAX_SIZE_MB}MB)
                </p>
              </div>
            </div>
            <FileUploadTrigger asChild>
              <Button variant="outline" size="sm" className="mt-3">
                Browse Files
              </Button>
            </FileUploadTrigger>
          </FileUploadDropzone>
          <FileUploadList>
            {files.map((file) => (
              <FileUploadItem key={file.name} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button variant="ghost" size="icon" className="size-7">
                    <X className="size-4" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </FileUpload>
      </CardContent>
    </Card>
  );
}