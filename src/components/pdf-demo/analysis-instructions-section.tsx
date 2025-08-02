import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface AnalysisInstructionsSectionProps {
  analysisPrompt: string;
  onAnalysisPromptChange: (prompt: string) => void;
  outputFormat: "excel" | "markdown";
  onOutputFormatChange: (format: "excel" | "markdown") => void;
  promptTemplates: Array<{ title: string; prompt: string }>;
  onStartAnalysis: () => void;
  disabled: boolean;
}

export function AnalysisInstructionsSection({
  analysisPrompt,
  onAnalysisPromptChange,
  outputFormat,
  onOutputFormatChange,
  promptTemplates,
  onStartAnalysis,
  disabled,
}: AnalysisInstructionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Instructions</CardTitle>
        <CardDescription>
          Choose your analysis type and output format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="analysis-prompt">Analysis Prompt</Label>
          <Textarea
            id="analysis-prompt"
            value={analysisPrompt}
            onChange={(e) => onAnalysisPromptChange(e.target.value)}
            placeholder="Describe what you want to extract from the PDF..."
            className="min-h-[250px] mt-2"
            rows={8}
          />
        </div>

        <div className="space-y-3">
          <Label>Output Format</Label>
          <RadioGroup
            value={outputFormat}
            onValueChange={(value) =>
              onOutputFormatChange(value as "excel" | "markdown")
            }
            className="flex flex-col gap-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="markdown" id="markdown" />
              <Label htmlFor="markdown" className="font-normal">
                Markdown Report (.md)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="font-normal">
                Excel Spreadsheet (.xlsx)
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Quick Templates</Label>
          <div className="grid gap-2">
            {promptTemplates
              .filter((template) => {
                const templateFormat = template.title
                  .toLowerCase()
                  .includes("excel")
                  ? "excel"
                  : "markdown";
                return templateFormat === outputFormat;
              })
              .map((template) => (
                <Button
                  key={template.title}
                  variant="outline"
                  size="sm"
                  className="justify-start text-left"
                  onClick={() => onAnalysisPromptChange(template.prompt)}
                >
                  <div className="font-medium">{template.title}</div>
                </Button>
              ))}
          </div>
        </div>

        <Button
          onClick={onStartAnalysis}
          disabled={disabled}
          className="w-full"
          size="lg"
        >
          Start Analysis
        </Button>
      </CardContent>
    </Card>
  );
}