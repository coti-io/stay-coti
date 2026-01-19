"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { connectWallet } from "../utils/wallet";
import { Award, Eye, Wallet, CheckCircle } from "lucide-react";

const awards = [
  {
    amount: "$450",
    blocker: "I need to Garble more than 1KB of data in a cost-efficient way",
    requirements: {
      title: "Garbling Data Solution",
      description:
        "Develop a cost-efficient method to garble more than 1KB of data while maintaining data integrity and security.",
      bulletPoints: [
        "Implement a garbling algorithm that can handle >1KB of data",
        "Demonstrate cost efficiency compared to existing methods",
        "Ensure data integrity is maintained post-garbling",
        "Provide benchmarks for different data sizes",
        "Include a simple API or interface for easy integration",
      ],
    },
  },
  {
    amount: "$75",
    blocker:
      "I need a tutorial on how to send a private transaction onto COTI with Bolt.new",
    requirements: {
      title: "COTI Private Transaction Tutorial",
      description:
        "Create a comprehensive tutorial explaining how to send a private transaction on COTI using Bolt.new.",
      bulletPoints: [
        "Step-by-step guide with code examples",
        "Explanation of key concepts and COTI's privacy features",
        "Screenshots or video demonstrations",
        "Troubleshooting section for common issues",
        "Links to relevant COTI and Bolt.new documentation",
      ],
    },
  },
  {
    amount: "$250",
    blocker:
      "Example repo on paying COTI when knowledge is added to a fine-tuning script",
    requirements: {
      title: "COTI Payment Integration for Fine-Tuning",
      description:
        "Develop a sample repository demonstrating how to integrate COTI payments when new knowledge is added to an AI fine-tuning script.",
      bulletPoints: [
        "Functional example repository with clear documentation",
        "Integration of COTI payment system",
        "Demonstration of fine-tuning script with knowledge addition",
        "Unit tests for key functionalities",
        "README with setup and usage instructions",
      ],
    },
  },
  {
    amount: "$50",
    blocker: "Ambassador program needs an introduction to Michael Polson",
    requirements: {
      title: "Michael Polson Introduction Strategy",
      description:
        "Create a comprehensive strategy to introduce the COTI Ambassador program to Michael Polson.",
      bulletPoints: [
        "Research on Michael Polson's background and interests",
        "Tailored presentation of COTI Ambassador program benefits",
        "Outreach plan with multiple contact methods",
        "Follow-up strategy and timeline",
        "Metrics for measuring success of the introduction",
      ],
    },
  },
  {
    amount: "$60",
    blocker: "A printable CMYK poster for a COTI create-a-thon in Tokyo",
    requirements: {
      title: "Tokyo COTI Create-a-thon Poster",
      description:
        "Design a visually appealing and informative CMYK poster for a COTI create-a-thon event in Tokyo.",
      bulletPoints: [
        "High-resolution design (at least 300 DPI)",
        "CMYK color profile for accurate printing",
        "Inclusion of key event details (date, venue, prizes)",
        "Incorporation of COTI branding and Tokyo-inspired elements",
        "Provided in both PDF and editable format (e.g., AI or PSD)",
      ],
    },
  },
  {
    amount: "$120",
    blocker:
      "Find a venue for 100 people that costs under $1,000 for ETH Denver",
    requirements: {
      title: "ETH Denver Venue Search",
      description:
        "Locate and secure a suitable venue in Denver for 100 people with a budget under $1,000 during ETH Denver.",
      bulletPoints: [
        "Venue details (location, capacity, amenities)",
        "Total cost breakdown (including any additional fees)",
        "Availability confirmation for ETH Denver dates",
        "Proximity to main ETH Denver events",
        "Photos or virtual tour of the venue",
      ],
    },
  },
];

function RequirementsModal({ open, onOpenChange, requirements }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{requirements.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="mb-4">{requirements.description}</p>
          <ul className="list-disc pl-5 space-y-2">
            {requirements.bulletPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CurrentAwards() {
  const [selectedRequirements, setSelectedRequirements] = useState(null);
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleAllocateCOTI = async () => {
    // const result = await connectWallet()
    // if (result && result.address) {
    //   setWalletAddress(result.address)
    // }
  };

  return (
    <section className="w-full py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center flex items-center justify-center">
          <span className="text-black">Farm Community Blockers</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8">
          Help solve tasks blocking the COTI community and earn rewards. Not all
          solutions receive awards so be sure to read our acceptance criteria
          before submitting. Have a blocker? Submit a problem and set a bounty
          here.
        </p>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    Award
                  </div>
                </TableHead>
                <TableHead>Blocker</TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Requirements
                  </div>
                </TableHead>
                <TableHead className="w-[120px]">
                  <div className="flex items-center">
                    <Wallet className="w-4 h-4 mr-1" />
                    Allocate COTI
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Fulfill
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {awards.map((award, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{award.amount}</TableCell>
                  <TableCell>{award.blocker}</TableCell>
                  <TableCell>
                    <Button
                      className="bg-purple-200 text-black hover:bg-purple-300 rounded-md border-none"
                      variant="sm"
                      onClick={() => {
                        setSelectedRequirements(award.requirements);
                        setIsRequirementsModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-orange-100 text-black hover:bg-orange-200 rounded-md border-none"
                      variant="sm"
                      onClick={handleAllocateCOTI}
                    >
                      {walletAddress ? "Connected" : "Connect Wallet"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      className="bg-indigo-100 text-black hover:bg-indigo-200 border-none"
                      variant="sm"
                      onClick={() =>
                        window.open(
                          "https://chatgpt.com/share/675fda31-2e80-800e-b33d-4c5aef717883",
                          "_blank"
                        )
                      }
                    >
                      Fulfill
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {selectedRequirements && (
          <RequirementsModal
            open={isRequirementsModalOpen}
            onOpenChange={setIsRequirementsModalOpen}
            requirements={selectedRequirements}
          />
        )}
      </div>
    </section>
  );
}

export default CurrentAwards;
