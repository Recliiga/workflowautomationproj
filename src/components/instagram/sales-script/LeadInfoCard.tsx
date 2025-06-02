
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Edit } from "lucide-react";
import { LeadInfo } from "./types";

interface LeadInfoCardProps {
  leadInfo: LeadInfo;
  onLeadInfoUpdate: (field: keyof LeadInfo, value: string) => void;
}

export function LeadInfoCard({ leadInfo, onLeadInfoUpdate }: LeadInfoCardProps) {
  const [isEditingLead, setIsEditingLead] = useState(false);

  return (
    <Card className="mb-6 border-2 border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Lead Information
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditingLead(!isEditingLead)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isEditingLead ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                <Input
                  id="name"
                  value={leadInfo.name}
                  onChange={(e) => onLeadInfoUpdate('name', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-xs font-medium">Company</Label>
                <Input
                  id="company"
                  value={leadInfo.company || ''}
                  onChange={(e) => onLeadInfoUpdate('company', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget" className="text-xs font-medium">Budget</Label>
                <Input
                  id="budget"
                  value={leadInfo.budget || ''}
                  onChange={(e) => onLeadInfoUpdate('budget', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="timeline" className="text-xs font-medium">Timeline</Label>
                <Input
                  id="timeline"
                  value={leadInfo.timeline || ''}
                  onChange={(e) => onLeadInfoUpdate('timeline', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
              <Textarea
                id="notes"
                value={leadInfo.notes || ''}
                onChange={(e) => onLeadInfoUpdate('notes', e.target.value)}
                className="h-20 resize-none"
              />
            </div>
            <Button 
              size="sm" 
              onClick={() => setIsEditingLead(false)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Save Changes
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong className="text-gray-600 dark:text-gray-400">Name:</strong> {leadInfo.name}</div>
            {leadInfo.company && <div><strong className="text-gray-600 dark:text-gray-400">Company:</strong> {leadInfo.company}</div>}
            {leadInfo.budget && <div><strong className="text-gray-600 dark:text-gray-400">Budget:</strong> {leadInfo.budget}</div>}
            {leadInfo.timeline && <div><strong className="text-gray-600 dark:text-gray-400">Timeline:</strong> {leadInfo.timeline}</div>}
            {leadInfo.notes && (
              <div className="col-span-2">
                <strong className="text-gray-600 dark:text-gray-400">Notes:</strong> {leadInfo.notes}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
