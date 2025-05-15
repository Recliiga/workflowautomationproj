
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmissionFormProps {
  title: string;
  description: string;
  notes: string;
  targetDate: Date | undefined;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onTargetDateChange: (date: Date | undefined) => void;
  onSubmit: () => void;
  filesCount: number;
}

export function SubmissionForm({
  title,
  description,
  notes,
  targetDate,
  onTitleChange,
  onDescriptionChange,
  onNotesChange,
  onTargetDateChange,
  onSubmit,
  filesCount
}: SubmissionFormProps) {
  return <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 space-y-6">
        <h3 className="text-lg font-medium">Submission Details</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="submission-title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input id="submission-title" placeholder="Enter a title for the entire submission" value={title} onChange={e => onTitleChange(e.target.value)} className="mt-1" required />
          </div>
          
          <div>
            <Label htmlFor="submission-description" className="text-sm font-medium">
              Video Context <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="submission-description" 
              placeholder="Provide rich details about your video - what's the main message, who's featured, key points discussed, and intended audience. These details directly enhance your caption quality." 
              value={description} 
              onChange={e => onDescriptionChange(e.target.value)} 
              className="mt-1 min-h-[120px]" 
              required 
            />
            <p className="text-xs text-muted-foreground mt-1.5">The more context you provide, the more engaging and effective your video captions will be.</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-medium mb-4">Target Calendar Date <span className="text-red-500">*</span></h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select when you'd like to publish the content. This helps freelancers prioritize urgent videos.
        </p>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full sm:w-[240px] justify-start text-left font-normal", !targetDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : <span>Select target date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={targetDate} onSelect={onTargetDateChange} disabled={date => date < new Date()} initialFocus className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={onSubmit} disabled={filesCount === 0}>
          Submit {filesCount} {filesCount === 1 ? 'Video' : 'Videos'}
        </Button>
      </div>
    </div>;
}
