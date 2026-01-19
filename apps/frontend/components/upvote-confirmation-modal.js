import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Wallet } from "lucide-react";

export default function UpvoteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  loadingUpvotes,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Upvote</DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            You need 0.01 COTI to upvote an idea. This helps prevent spam and
            ensures quality upvote.
          </p>
        </div>
        <DialogFooter className="mt-6">
          <Button
            onClick={onConfirm}
            disabled={loadingUpvotes}
            className="w-full bg-[#E9D5FF] hover:bg-[#E9D5FF]/80 text-black rounded-xl"
          >
            {loadingUpvotes ? (
              <Loader2 className="animate-spin" />
            ) : (
              <p>Upvote</p>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
