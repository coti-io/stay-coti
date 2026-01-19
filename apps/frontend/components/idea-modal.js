import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useState } from "react";
import { X } from "lucide-react"; // Add this import

export default function IdeaModal({ open, onOpenChange, idea }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!idea) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{idea.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="mt-1">{idea.category?.name || "Uncategorized"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-1">
              {format(new Date(idea._publishedAt), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <div className="relative">
              <div
                className={`mt-1 ${
                  isExpanded ? "max-h-[300px] overflow-y-auto pr-2" : ""
                }`}
              >
                <p className={`${!isExpanded ? "line-clamp-3" : ""}`}>
                  {idea.description}
                </p>
              </div>
              {idea.description.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  {isExpanded ? "View Less" : "View More"}
                </button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
