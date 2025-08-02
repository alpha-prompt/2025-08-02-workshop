import { encode as o200k_encode } from "gpt-tokenizer/encoding/o200k_base";
import { encode as p50k_encode } from "gpt-tokenizer/encoding/p50k_base";
import { useMemo, useState } from "react";

import {
  sampleTextOrder,
  sampleTexts,
  type SampleTextType,
} from "@/data/sample-texts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const tokenizers = {
  o200k_base: {
    encode: o200k_encode,
    name: "GPT-4o (o200k_base)",
    vocabSize: "~200,000",
    color: "bg-blue-100",
  },
  p50k_base: {
    encode: p50k_encode,
    name: "text-davinci-003 (p50k_base)",
    vocabSize: "~50,000",
    color: "bg-green-100",
  },
};

type ComparisonTextType = SampleTextType;

const getSampleDisplayName = (key: SampleTextType): string => {
  switch (key) {
    case "complexEnglish":
      return "Complex English";
    case "scientific":
      return "Scientific";
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
};

const ComparisonResult = ({
  title,
  tokens,
  color,
  vocabSize,
}: {
  title: string;
  tokens: number[];
  color: string;
  vocabSize: string;
}) => (
  <div className={`p-4 rounded-lg ${color}`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-semibold">{title}</h3>
      <span className="text-sm text-muted-foreground">{vocabSize}</span>
    </div>
    <div className="text-2xl font-bold text-center mb-2">{tokens.length}</div>
    <div className="text-sm text-center text-muted-foreground">tokens</div>
  </div>
);

export function TokenizerComparison() {
  const [inputText, setInputText] = useState(sampleTexts.english);

  const results = useMemo(() => {
    return Object.entries(tokenizers).map(([key, tokenizer]) => ({
      key,
      name: tokenizer.name,
      tokens: tokenizer.encode(inputText),
      color: tokenizer.color,
      vocabSize: tokenizer.vocabSize,
    }));
  }, [inputText]);

  const handleSampleSelect = (sample: ComparisonTextType) => {
    setInputText(sampleTexts[sample]);
  };

  const tokenDifference = Math.abs(
    results[0].tokens.length - results[1].tokens.length,
  );
  const efficiency =
    results[0].tokens.length < results[1].tokens.length
      ? results[0].name
      : results[1].name;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tokenizer Comparison</CardTitle>
          <CardDescription>
            Compare how different tokenizers process the same text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sample Text
            </label>
            <div className="flex flex-wrap gap-2 mb-4">
              {sampleTextOrder.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSampleSelect(key)}
                >
                  {getSampleDisplayName(key)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Input Text</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to compare tokenization..."
              className="min-h-[120px] font-mono"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((result) => (
              <ComparisonResult
                key={result.key}
                title={result.name}
                tokens={result.tokens}
                color={result.color}
                vocabSize={result.vocabSize}
              />
            ))}
          </div>

          <div className="p-4 bg-gray-50  rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {inputText.length}
                </div>
                <div className="text-sm text-muted-foreground">Characters</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {tokenDifference}
                </div>
                <div className="text-sm text-muted-foreground">
                  Token Difference
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {(
                    (tokenDifference /
                      Math.max(
                        results[0].tokens.length,
                        results[1].tokens.length,
                      )) *
                    100
                  ).toFixed(1)}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Efficiency Gap
                </div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">
                  {efficiency.includes("GPT-4o") ? "GPT-4o" : "Davinci"}
                </div>
                <div className="text-sm text-muted-foreground">
                  More Efficient
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50  p-4 rounded-lg">
            <h4 className="font-semibold mb-2">
              Understanding Tokens & Key Insights:
            </h4>
            <div className="prose dark:prose-invert max-w-none text-sm mb-4">
              <p className="text-muted-foreground">
                Tokens are the basic units that AI language models use to
                process text. Rather than working with individual characters or
                words, models break text into tokens - which can be whole words,
                parts of words, or even single characters.
              </p>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                • <strong>Subword tokenization:</strong> Most modern models use
                algorithms like BPE (Byte Pair Encoding)
              </li>
              <li>
                • <strong>Context windows:</strong> Models have limits on how
                many tokens they can process at once
              </li>
              <li>
                • <strong>Cost implications:</strong> API pricing and context
                window usage are based on token count
              </li>
              <li>
                • <strong>Vocabulary size matters:</strong> Larger vocabularies
                (GPT-4o) typically use fewer tokens for the same text
              </li>
              <li>
                • <strong>Content type performance:</strong> Different
                tokenizers excel with different content types (code, languages,
                etc.)
              </li>
              <li>
                • <strong>Language efficiency:</strong> Different tokenizers
                perform better with different languages
              </li>
              <li>
                • <strong>Cross-language differences:</strong> Asian languages
                often show more dramatic differences between tokenizers
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
