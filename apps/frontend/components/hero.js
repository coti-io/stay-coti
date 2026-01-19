"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import HeroGrid from "./hero-grid";
import useAnimatedPlaceholder from "./AnimatedPlaceholder";
import { useScrollHandler } from "@/utils/scroll-utils";
import { useAddIdea } from "@/hooks/useAddIdea";
import AddIdeaModal from "./add-idea-modal";
import { queryClient } from "@/utils/query-client";
import toast from "react-hot-toast";
import { STORAGE_AUTH_KEY } from "@/utils/api";
import { useMenuSections } from "@/hooks/useMenuSections";
import ConnectWalletModal from "./connect-wallet-modal";
import { sendGA4 } from "@/utils/helpers";

export default function Hero() {
  // Add the menu sections query
  const { data: menuData } = useMenuSections();
  const heroSection = menuData?.data?.allMenuSections?.find(
    (section) => section.sectionId === "Hero"
  );
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showConnectWalletForVote, setShowConnectWalletForVote] =
    useState(false);

  const { addIdea: handleAddIdea, isLoading: isAddingIdea } = useAddIdea({
    onSuccess: () => {
      setShowAddIdeaModal(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!input.trim()) return;

    // setIsOpen(true);
    // setMessages([...messages, { role: "user", content: input }]);
    // setInput("");
  };

  const placeholder = useAnimatedPlaceholder();

  const isShowModal = () => {
    const token = queryClient.getQueryData([STORAGE_AUTH_KEY]);

    if (!token) {
      setShowConnectWalletForVote(true);
      return;
    }

    setShowAddIdeaModal(true);
  };

  useEffect(() => {
    sendGA4({
      eventName: "page_views",
      params: {
        page_location: "/",
        page_title: "COTI Community",
      },
    });
  }, []);

  return (
    <section className="w-full pt-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="bg-black text-white rounded-3xl p-12 md:p-16 lg:p-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-2">
              {heroSection ? (
                heroSection?.sectionName || ""
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="h-16 bg-gray-700 animate-pulse rounded-lg mb-3 w-[80%]"></div>
                  <div className="h-16 bg-gray-700 animate-pulse rounded-lg w-full"></div>
                </div>
              )}
            </h1>

            <div className="max-w-2xl mx-auto">
              <form
                onSubmit={handleSubmit}
                className="flex md:gap-0 min-[320px]:gap-2 mi md:flex-row min-[320px]:flex-col w-full items-center gap-0"
              >
                <div className="relative flex-1 w-full">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="w-full min-w-xl rounded-xl md:rounded-r-none min-[320px]:rounded-xl h-12 text-base bg-white text-black border-r-0"
                  />
                </div>
                <Button
                  onClick={() => isShowModal()}
                  className="h-[48px] px-6 rounded-xl md:rounded-l-none min-[320px]:rounded-xl bg-emerald-100 text-black hover:bg-emerald-200 border-l-0 transition-colors duration-200"
                >
                  Add an Idea
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto">
              <p
                dangerouslySetInnerHTML={{
                  __html: heroSection?.sectionDescription || "",
                }}
              ></p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Chat with COTI</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-8">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <div className="prose prose-sm">
                      {message.content.split("\n").map((line, j) => (
                        <p key={j} className="mb-2">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <AddIdeaModal
        open={showAddIdeaModal}
        onOpenChange={setShowAddIdeaModal}
        categories={queryClient.getQueryData(["categoriesData"]) || []}
        onSubmit={handleAddIdea}
        data={input}
      />
      <ConnectWalletModal
        open={showConnectWalletForVote}
        onOpenChange={setShowConnectWalletForVote}
        title="Connect Wallet Required"
        description="Please connect to your wallet to add a new idea"
        buttonText="Connect Wallet"
        isConnectWallet={true}
      />
    </section>
  );
}
