import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { createFileRoute } from "@tanstack/react-router";

import { getDemoWithPromptTemplates } from "@/data/demo-cards";
import { usePdfState } from "@/hooks/use-pdf-state";
import { AnalysisInstructionsSection } from "@/components/pdf-demo/analysis-instructions-section";
import { FileUploadSection } from "@/components/pdf-demo/file-upload-section";
import { PDFAnalysisChat } from "@/components/pdf-demo/pdf-analysis-chat";
import { WorkshopLayout } from "@/components/workshop-layout";

export const Route = createFileRoute("/demo-pdf")({
  component: DemoPdf,
});

function DemoPdf() {
  const pdfDemo = getDemoWithPromptTemplates("/demo-pdf");

  const {
    files,
    setFiles,
    analysisPrompt,
    setAnalysisPrompt,
    outputFormat,
    setOutputFormat,
    analysisStarted,
    setAnalysisStarted,
    resetState,
  } = usePdfState();

  const handleStartAnalysis = () => {
    if (!files[0] || !analysisPrompt.trim()) return;
    setAnalysisStarted(true);
  };

  const handleResetDemo = () => {
    resetState();
    // Reset the runtime
    window.location.reload();
  };

  const runtime = useChatRuntime({
    api: "/api/pdf",
    body: {
      outputFormat,
    },
  });

  return (
    <WorkshopLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{pdfDemo.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {pdfDemo.description}
          </p>
        </div>

        {!analysisStarted ? (
          <div className="space-y-6">
            <FileUploadSection
              files={files}
              onFilesChange={setFiles}
            />
            <AnalysisInstructionsSection
              analysisPrompt={analysisPrompt}
              onAnalysisPromptChange={setAnalysisPrompt}
              outputFormat={outputFormat}
              onOutputFormatChange={setOutputFormat}
              promptTemplates={pdfDemo.promptTemplates}
              onStartAnalysis={handleStartAnalysis}
              disabled={!files[0] || !analysisPrompt.trim()}
            />
          </div>
        ) : (
          <AssistantRuntimeProvider runtime={runtime}>
            <PDFAnalysisChat
              file={files[0]!}
              fileName={files[0]!.name}
              analysisPrompt={analysisPrompt}
              outputFormat={outputFormat}
              onReset={handleResetDemo}
            />
          </AssistantRuntimeProvider>
        )}
      </div>
    </WorkshopLayout>
  );
}
