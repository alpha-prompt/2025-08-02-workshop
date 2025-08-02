import { ToolCallContentPartComponent } from "@assistant-ui/react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";

export const ToolFallback: ToolCallContentPartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isRunning = status.type === "running";

  return (
    <div className="mb-4 flex w-full flex-col gap-3 rounded-lg border py-3">
      <div className="flex items-center gap-2 px-4">
        {isRunning ? (
          <Loader2Icon className="size-4 animate-spin text-blue-600" />
        ) : (
          <CheckIcon className="size-4 text-green-600" />
        )}
        <p className="">
          {isRunning ? "Running tool" : "Used tool"}: <b>{toolName}</b>
        </p>
        <div className="flex-grow" />
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
        </Button>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col gap-2 border-t pt-2">
          <div className="px-4">
            <pre className="whitespace-pre-wrap">{argsText}</pre>
          </div>
          {result !== undefined && (
            <div className="border-t border-dashed px-4 pt-2">
              <p className="font-semibold">Result:</p>
              <pre className="whitespace-pre-wrap">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          {isRunning && result === undefined && (
            <div className="border-t border-dashed px-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Waiting for results...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
