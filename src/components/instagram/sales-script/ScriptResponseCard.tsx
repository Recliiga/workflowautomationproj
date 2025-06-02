
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle } from "lucide-react";
import { ScriptResponse, LeadInfo } from "./types";

interface ScriptResponseCardProps {
  response: ScriptResponse;
  leadInfo: LeadInfo;
}

export function ScriptResponseCard({ response, leadInfo }: ScriptResponseCardProps) {
  const [copiedId, setCopiedId] = useState<string>("");

  const personalizeText = (text: string): string => {
    return text
      .replace(/{name}/g, leadInfo.name || "[Name]")
      .replace(/{company}/g, leadInfo.company || "[Company]")
      .replace(/{service_type}/g, "premium video production")
      .replace(/{process_overview}/g, "discovery call → proposal → production → delivery");
  };

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return "text-green-600 dark:text-green-400";
    if (effectiveness >= 80) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleResponseClick = () => {
    const personalizedText = personalizeText(response.text);
    navigator.clipboard.writeText(personalizedText);
    setCopiedId(response.id);
    setTimeout(() => setCopiedId(""), 2000);
    console.log("Copied to clipboard:", personalizedText);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-400">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1 pr-4">
              {personalizeText(response.text)}
            </p>
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={`text-xs ${getEffectivenessColor(response.effectiveness)}`}
              >
                {response.effectiveness}%
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex-1">
              {response.context}
            </p>
            <Button 
              size="sm"
              onClick={handleResponseClick}
              className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-sm group-hover:shadow-md transition-all duration-200"
            >
              {copiedId === response.id ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
