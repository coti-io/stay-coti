'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function IdeasModal({ open, onOpenChange, data = [], title, description }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Ideas</TableHead>
              <TableHead className="w-[35%]">Possible Tools</TableHead>
              <TableHead className="w-[15%]">Find Fellow Creators</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="align-top">{item.idea}</TableCell>
                <TableCell className="align-top">
                  <div className="space-y-1">
                    {item.tools.map((tool, toolIndex) => (
                      <a
                        key={toolIndex}
                        href={tool.toolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        {tool.toolName}
                      </a>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center h-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(item.cta.ctaUrl, '_blank')}
                    >
                      {item.cta.ctaName}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

