import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Link from "next/link";
import { ConnectKitButton } from "connectkit";

export default function ConnectWalletModal({
  open,
  onOpenChange,
  title,
  description,
  buttonText,
  isConnectWallet = false,
  handleChange,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <p className="text-gray-500 text-sm mt-2">{description}</p>
        </DialogHeader>
        <div className="mt-4">
          {isConnectWallet ? (
            <ConnectKitButton.Custom>
              {({ show, isConnecting }) => {
                return (
                  <Button
                    onClick={show}
                    disabled={isConnecting}
                    className="w-full bg-[#E9D5FF] hover:bg-[#E9D5FF]/80 text-black rounded-xl flex items-center justify-center gap-2"
                  >
                    Connect Your Wallet
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          ) : (
            <Link href={"https://faucet.coti.io/"} target="_blank">
              <Button
                className="w-full bg-[#E9D5FF] hover:bg-[#E9D5FF]/80 text-black rounded-xl flex items-center justify-center gap-2"
                onClick={() => {
                  handleChange();
                  onOpenChange(false);
                }}
              >
                <Wallet size={18} />
                {buttonText}
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
