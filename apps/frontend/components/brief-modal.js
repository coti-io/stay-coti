import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export default function BriefModal({ 
  open, 
  onOpenChange, 
  icon, 
  header, 
  subheader, 
  introText, 
  bodyText 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-6">
            {icon}
            <DialogTitle className="text-xl font-bold">{header}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="brief-header">
          <div className="subheader font-medium text-lg mb-2">{subheader}</div>
          <div className="intro-text text-gray-600 mb-6">{introText}</div>
        </div>

        <div className="brief-content prose prose-headings:font-bold prose-headings:text-xl prose-p:text-gray-600 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-li:text-gray-600">
          {bodyText}
        </div>
      </DialogContent>
    </Dialog>
  )
}

