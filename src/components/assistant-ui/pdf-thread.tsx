import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCwIcon,
  SendHorizontalIcon,
} from "lucide-react";
import type { FC } from "react";
import * as XLSX from "xlsx";

import { cn } from "@/lib/utils";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ToolFallback } from "./tool-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ToolCallContentPartComponent } from "@assistant-ui/react";

interface PDFThreadProps {
  fileName: string;
  outputFormat: "excel" | "markdown";
  onReset: () => void;
}

export const PDFThread: FC<PDFThreadProps> = ({ fileName, outputFormat, onReset }) => {
  return (
    <ThreadPrimitive.Root
      className="bg-background box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <PDFWelcome fileName={fileName} onReset={onReset} />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const PDFWelcome: FC<{ fileName: string; onReset: () => void }> = ({ 
  fileName, 
  onReset 
}) => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">PDF Analysis Starting</h3>
            <p className="text-muted-foreground mb-2">Analyzing: {fileName}</p>
            <p className="text-sm text-muted-foreground">
              The AI agent will process your document and provide structured analysis...
            </p>
          </div>
          <button
            onClick={onReset}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-muted transition-colors"
          >
            Upload Different PDF
          </button>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
      <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
        <MessagePrimitive.Content />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
        <MessagePrimitive.Content
          components={{ 
            Text: MarkdownText, 
            tools: { 
              Fallback: ToolFallback,
              by_name: {
                "generate-excel": ExcelDownloadTool,
                "generate-markdown": MarkdownDownloadTool
              }
            } 
          }}
        />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-end rounded-lg border bg-white px-2.5 shadow-sm transition-colors ease-in">
      <ComposerPrimitive.Input
        rows={1}
        placeholder="Ask follow-up questions about your PDF..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton
          tooltip="Send"
          variant="default"
          className="my-2.5 size-8 p-2"
        >
          <SendHorizontalIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

const ExcelDownloadTool: ToolCallContentPartComponent = (props) => {
  const { result } = props;
  const handleDownload = () => {
    if (result?.type === "excel_data" && result?.data) {
      // Create worksheet from data
      const ws = XLSX.utils.json_to_sheet(result.data);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, result.sheetName || "Analysis");
      
      // Generate and download the file
      XLSX.writeFile(wb, result.filename || "pdf-analysis.xlsx");
    }
  };

  if (result?.type !== "excel_data") {
    return <ToolFallback {...props} />;
  }

  return (
    <Card className="my-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="size-5 text-green-600" />
            <div>
              <p className="font-medium">Excel file ready</p>
              <p className="text-sm text-muted-foreground">
                {result.filename} • {result.data?.length || 0} rows
              </p>
            </div>
          </div>
          <Button onClick={handleDownload} size="sm">
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </div>
        {result.message && (
          <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
        )}
      </CardContent>
    </Card>
  );
};

const MarkdownDownloadTool: ToolCallContentPartComponent = (props) => {
  const { result } = props;
  const handleDownload = () => {
    if (result?.type === "markdown_data" && result?.content) {
      // Create and download the markdown file
      const blob = new Blob([result.content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.filename || "pdf-analysis.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (result?.type !== "markdown_data") {
    return <ToolFallback {...props} />;
  }

  return (
    <Card className="my-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="size-5 text-blue-600" />
            <div>
              <p className="font-medium">Markdown document ready</p>
              <p className="text-sm text-muted-foreground">
                {result.filename}
              </p>
            </div>
          </div>
          <Button onClick={handleDownload} size="sm">
            <Download className="size-4 mr-2" />
            Download
          </Button>
        </div>
        {result.message && (
          <p className="text-sm text-muted-foreground mt-2">{result.message}</p>
        )}
      </CardContent>
    </Card>
  );
};