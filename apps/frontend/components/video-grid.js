"use client";

import { useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { connectWallet } from "../utils/wallet";

function VideoEmbed({ url, title }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "100px 0px",
  });

  const getVideoId = useCallback((url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, []);

  return (
    <div ref={ref} className="aspect-video w-full">
      {inView ? (
        <iframe
          src={`https://www.youtube.com/embed/${getVideoId(url)}?controls=1`}
          title={title}
          className="w-full h-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  );
}

function TipModal({ open, onOpenChange, creatorName }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    // setIsConnecting(true);
    // const result = await connectWallet();
    // setIsConnecting(false);
    // if (result && result.address) {
    //   setWalletAddress(result.address);
    // }
  };

  const formatAddress = (address) => {
    const start = address.slice(0, 6);
    const end = address.slice(-4);
    const middle = Array.from(
      { length: 6 },
      () => ["🚀", "💎", "🌟", "🔥"][Math.floor(Math.random() * 4)]
    ).join("");
    return `${start}${middle}${end}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Tip {creatorName}
          </DialogTitle>
        </DialogHeader>

        {!walletAddress ? (
          <Button
            onClick={handleConnectWallet}
            className="w-full mt-4 bg-purple-200 text-black hover:bg-purple-300 rounded-md border-none"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet to Tip"}
          </Button>
        ) : (
          <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg mt-4 text-white">
            <p className="text-lg font-bold mb-2">Wallet Connected! 🎉</p>
            <p className="font-mono">{formatAddress(walletAddress)}</p>
            <p className="mt-4">Ready to send tip to {creatorName}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function VideoGrid({ title, description, videos }) {
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: "200px 0px",
  });

  const handleTipClick = useCallback((creatorName) => {
    setSelectedCreator(creatorName);
    setIsTipModalOpen(true);
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            {description}
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
        >
          {inView &&
            videos.map((video, index) => (
              <div
                key={video.url}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <VideoEmbed url={video.url} title={video.title} />
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-base sm:text-lg">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 text-xs sm:text-sm mb-4">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center text-sm font-medium text-gray-700">
                      <Coins className="w-4 h-4 mr-1.5 text-yellow-500" />
                      Award: ${video.award}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTipClick(video.title)}
                      className="text-sm bg-purple-200 text-black hover:bg-purple-300 rounded-md border-none"
                    >
                      Tip Creator
                    </Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <TipModal
        open={isTipModalOpen}
        onOpenChange={setIsTipModalOpen}
        creatorName={selectedCreator}
      />
    </section>
  );
}
