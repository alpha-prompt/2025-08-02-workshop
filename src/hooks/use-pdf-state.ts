import { useState } from "react";

export function usePdfState() {
  const [files, setFiles] = useState<File[]>([]);
  const [analysisPrompt, setAnalysisPrompt] = useState("");
  const [outputFormat, setOutputFormat] = useState<"excel" | "markdown">("markdown");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const resetState = () => {
    setFiles([]);
    setAnalysisPrompt("");
    setOutputFormat("markdown");
    setAnalysisStarted(false);
  };

  return {
    files,
    setFiles,
    analysisPrompt,
    setAnalysisPrompt,
    outputFormat,
    setOutputFormat,
    analysisStarted,
    setAnalysisStarted,
    resetState,
  };
}