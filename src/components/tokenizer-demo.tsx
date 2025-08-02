import {
  decode as cl100k_decode,
  encode as cl100k_encode,
} from "gpt-tokenizer/encoding/cl100k_base";
import {
  decode as o200k_decode,
  encode as o200k_encode,
} from "gpt-tokenizer/encoding/o200k_base";
import {
  decode as p50k_decode,
  encode as p50k_encode,
} from "gpt-tokenizer/encoding/p50k_base";
import {
  decode as r50k_decode,
  encode as r50k_encode,
} from "gpt-tokenizer/encoding/r50k_base";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const tokenizers = {
  o200k_base: {
    encode: o200k_encode,
    decode: o200k_decode,
    name: "o200k_base (GPT-4o)",
    vocabSize: "~200,000",
  },
  cl100k_base: {
    encode: cl100k_encode,
    decode: cl100k_decode,
    name: "cl100k_base (GPT-4, GPT-3.5)",
    vocabSize: "~100,000",
  },
  p50k_base: {
    encode: p50k_encode,
    decode: p50k_decode,
    name: "p50k_base (GPT-3.5-turbo)",
    vocabSize: "~50,000",
  },
  r50k_base: {
    encode: r50k_encode,
    decode: r50k_decode,
    name: "r50k_base (text-davinci-003)",
    vocabSize: "~50,000",
  },
};

const pastelColors = [
  "rgba(107,64,216,.3)",
  "rgba(104,222,122,.4)",
  "rgba(244,172,54,.4)",
  "rgba(239,65,70,.4)",
  "rgba(39,181,234,.4)",
  "rgba(255,182,193,.4)",
  "rgba(173,216,230,.4)",
  "rgba(240,230,140,.4)",
  "rgba(221,160,221,.4)",
  "rgba(152,251,152,.4)",
];

type TokenizerType = keyof typeof tokenizers;

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

const TokenizedText = ({
  tokens,
  tokenizer,
}: {
  tokens: number[];
  tokenizer: { decode: (tokens: number[]) => string };
}) => {
  const decodedTokens = useMemo(() => {
    return tokens.map((token) => tokenizer.decode([token]));
  }, [tokens, tokenizer]);

  return (
    <div className="flex flex-wrap gap-0 font-mono text-sm p-4 border rounded-lg bg-gray-50  max-h-64 overflow-y-auto leading-relaxed">
      {decodedTokens.map((token, index) => (
        <span
          key={index}
          className="inline-block border border-gray-300  rounded-sm px-1 mb-1 mr-0.5"
          style={{
            backgroundColor: pastelColors[index % pastelColors.length],
          }}
        >
          {token.replace(/\n/g, "\\n").replace(/ /g, "·")}
        </span>
      ))}
    </div>
  );
};

export function TokenizerDemo() {
  const [inputText, setInputText] = useState(sampleTexts.english);
  const [selectedTokenizer, setSelectedTokenizer] =
    useState<TokenizerType>("o200k_base");
  const [displayMode, setDisplayMode] = useState<"tokens" | "ids">("tokens");

  const tokenizer = tokenizers[selectedTokenizer];
  const encodedTokens = useMemo(
    () => tokenizer.encode(inputText),
    [inputText, tokenizer],
  );

  const handleSampleSelect = (sample: SampleTextType) => {
    setInputText(sampleTexts[sample]);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tokenizer Playground</CardTitle>
          <CardDescription>
            Explore how different AI models break down text into tokens
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Model/Tokenizer
              </label>
              <Select
                value={selectedTokenizer}
                onValueChange={(value) =>
                  setSelectedTokenizer(value as TokenizerType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tokenizers).map(([key, tokenizer]) => (
                    <SelectItem key={key} value={key}>
                      {tokenizer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Vocabulary size: {tokenizer.vocabSize}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Sample Text
              </label>
              <div className="flex flex-wrap gap-2">
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
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Input Text</label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text to tokenize..."
              className="min-h-[120px] font-mono"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={displayMode === "tokens" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("tokens")}
              >
                Show Tokens
              </Button>
              <Button
                variant={displayMode === "ids" ? "default" : "outline"}
                size="sm"
                onClick={() => setDisplayMode("ids")}
              >
                Show Token IDs
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInputText("")}
            >
              Clear
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {displayMode === "tokens" ? "Tokenized Text" : "Token IDs"}
            </label>
            {displayMode === "tokens" ? (
              <TokenizedText tokens={encodedTokens} tokenizer={tokenizer} />
            ) : (
              <div className="font-mono text-sm p-4 border rounded-lg bg-gray-50 max-h-64 overflow-y-auto">
                {encodedTokens.map((token, index) => (
                  <span
                    key={index}
                    className="inline-block border border-gray-300  rounded-sm px-2 py-1 mb-1 mr-1"
                    style={{
                      backgroundColor:
                        pastelColors[index % pastelColors.length],
                    }}
                  >
                    {token}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50  rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {inputText.length}
              </div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {encodedTokens.length}
              </div>
              <div className="text-sm text-muted-foreground">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(encodedTokens.length / inputText.length).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Tokens/Char</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
