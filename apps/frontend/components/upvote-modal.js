import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  Gift,
  Coins,
  AlertCircle,
  ArrowRight,
  PiggyBank,
  Building,
  Wallet,
} from "lucide-react";
import { connectWallet } from "../utils/wallet";

export default function UpvoteModal({ open, onOpenChange, projectTitle }) {
  const [walletAddress, setWalletAddress] = useState(null);

  const handleConnectWallet = async () => {
    // const address = await connectWallet();
    // if (address) {
    //   setWalletAddress(address);
    // }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <ThumbsUp className="w-6 h-6" />
            COTI Upvoting System
          </DialogTitle>
        </DialogHeader>

        {!walletAddress ? (
          <Button onClick={handleConnectWallet} className="w-full mt-4">
            <Wallet className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <div className="bg-green-100 p-4 rounded-lg mt-4">
            <p className="text-green-800 font-medium">
              {walletAddress} has successfully upvoted {projectTitle}!
            </p>
          </div>
        )}

        <div className="space-y-6 py-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg font-medium mb-4">
              COTI uses a skin-in-the-game upvoting system to ensure upvotes are
              genuine. Here's how you can participate:
            </p>

            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 mt-1 text-blue-500" />
                <p className="font-medium">
                  1 Upvote = 1 COTI. Upvote as many times as you wish.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 mt-1 text-green-500" />
                <p className="font-medium">
                  If you have COTI OG or Node License NFT you can upvote 1 x per
                  project for free
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-lg mb-4">
              Don't have COTI or an OG or Node License NFT? We want to ensure
              anyone can become an active COTI community member.
            </p>

            <Button
              variant="outline"
              className="w-full bg-white hover:bg-blue-50 group"
            >
              <span>
                Click here for 10 easy ways to get COTI without needing to buy
                it
              </span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {!walletAddress && (
            <div className="space-y-6">
              <div className="border-l-4 border-amber-500 pl-4">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                  <PiggyBank className="w-5 h-5 text-amber-500" />
                  What happens to the COTI I use to upvote?
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    90% of COTI spent in upvoting goes to the reward pool
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    10% of the COTI spent goes to the Creators fund which covers
                    more events, projects, dev time etc...
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-purple-500" />
                  What happens to upvoted funds if a project fails?
                </h3>
                <div className="flex items-start gap-2 text-gray-700">
                  <Building className="w-5 h-5 mt-1 text-purple-500 shrink-0" />
                  <p>
                    100% of COTI added to a Reward Pool is given to the Creators
                    Fund which covers more events, projects, dev time etc...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
