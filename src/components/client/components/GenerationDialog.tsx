
import { Video } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVideo: Video | null;
  currentCreditsUsed: number;
  monthlyCredits: number;
  onConfirm: () => void;
}

export function GenerationDialog({
  open,
  onOpenChange,
  selectedVideo,
  currentCreditsUsed,
  monthlyCredits,
  onConfirm
}: GenerationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Newsletter Template Generation</AlertDialogTitle>
          <AlertDialogDescription>
            This action will generate a newsletter template for "{selectedVideo?.title}" and will consume 1 credit from your monthly allowance. 
            <br /><br />
            You will have 2 free revisions available after the initial generation.
            <br /><br />
            Current usage: {currentCreditsUsed}/{monthlyCredits} credits
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Generate Template (Use 1 Credit)
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
