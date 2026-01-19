'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DiscIcon as Discord } from 'lucide-react'
import { medicalIdeas } from '@/data/medical-ideas-data'

export default function MedicalDataModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Medical Data App Ideas</DialogTitle>
          <DialogDescription className="text-lg">
            Explore potential projects that leverage COTI's privacy framework for healthcare
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
            {medicalIdeas.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="align-top">{item.idea}</TableCell>
                <TableCell className="align-top">
                  <div className="space-y-1">
                    {item.tools.map((tool, toolIndex) => (
                      <div key={toolIndex} className="inline-block mr-2 mb-2 px-2 py-1 bg-gray-100 rounded-md text-sm">
                        {tool}
                      </div>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center h-full">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Discord className="w-4 h-4" />
                      Discord
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

