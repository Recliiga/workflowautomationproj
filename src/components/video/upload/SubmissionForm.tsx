
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface SubmissionFormProps {
  title: string;
  description: string;
  targetDate: Date | undefined;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onTargetDateChange: (date: Date | undefined) => void;
  onSubmit: () => void;
  filesCount: number;
  disabled?: boolean;
}

export function SubmissionForm({
  title,
  description,
  targetDate,
  onTitleChange,
  onDescriptionChange,
  onTargetDateChange,
  onSubmit,
  filesCount,
  disabled = false
}: SubmissionFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a description"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="h-24"
          disabled={disabled}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="target-date">Target Publish Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="target-date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !targetDate && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {targetDate ? format(targetDate, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={targetDate}
              onSelect={onTargetDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={filesCount === 0 || disabled}
      >
        {disabled ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
}
