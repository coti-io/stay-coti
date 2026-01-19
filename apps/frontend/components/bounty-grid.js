"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, ThumbsUp, Search, X } from "lucide-react";
import BriefModal from "./brief-modal";
import UpvoteModal from "./upvote-modal"; // Import UpvoteModal
import { briefData } from "../data/brief-data";
import { bounties } from "../data/bounties-data";
import { fetchIdeas, fetchCategories, addIdea } from "../lib/datocms";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
// Add to imports
import AddIdeaModal from "./add-idea-modal";
import { Button } from "@/components/ui/button";

// Add to imports
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Add to imports at the top
import { FileQuestion } from "lucide-react";

// Add to imports
import IdeaModal from "./idea-modal";
import { useAddIdea } from "@/hooks/useAddIdea";
import { useUpvote } from "@/hooks/useUpvote";
import { useIdeas } from "@/hooks/useIdeas";
import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { VOTE_RECEIVER_ADDRESS } from "@/config/common";
import { parseEther } from "viem";
import toast from "react-hot-toast";
import { useMenuSections } from "@/hooks/useMenuSections";
import { queryClient } from "@/utils/query-client";
import { STORAGE_AUTH_KEY } from "@/utils/api";

// Add to imports
import UpvoteConfirmationModal from "./upvote-confirmation-modal";
import ConnectWalletModal from "./connect-wallet-modal";
import useAuth from "@/hooks/useAuth";

export default function BountyGrid() {
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isUpvoteModalOpen, setIsUpvoteModalOpen] = useState(false); // Add UpvoteModal state
  const [selectedProjectTitle, setSelectedProjectTitle] = useState(null); //Update 1
  // Consolidate state declarations
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [loadingUpvotes, setLoadingUpvotes] = useState(null);
  const [showUpvoteConfirmation, setShowUpvoteConfirmation] = useState(false);
  const [pendingUpvoteIdea, setPendingUpvoteIdea] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [loadingDots, setLoadingDots] = useState("");
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const { sendTransactionAsync } = useSendTransaction();
  const { isLoggedIn } = useAuth();
  const token = queryClient.getQueryData([STORAGE_AUTH_KEY]);

  const [tokenValid, setTokenValid] = useState(token);

  const { data: menuData } = useMenuSections();
  const ideasSection = menuData?.data?.allMenuSections?.find((section) => section.sectionId === "Ideas");

  const itemsPerPage = 6;
  const searchTimeout = useRef(null);

  const { upvote, isPending: isUpvoting } = useUpvote();

  const [sortBy, setSortBy] = useState("_publishedAt");

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    loadCategories();
  }, []);

  const checkEnoughBalance = async (value) => {
    const balance = await publicClient.getBalance({ address: address });
    if (balance < parseEther(value)) {
      setShowBalanceModal(true);
      return false;
    }
    const gasPrice = await publicClient.getGasPrice();
    const estimatedGas = await publicClient.estimateGas({
      account: address,
    });
    const gasFee = estimatedGas * gasPrice;
    const totalFee = gasFee + parseEther(value);
    if (balance < totalFee) {
      toast.error("Insufficient gas fee");
      return false;
    }
    return true;
  };

  // Add state for connect wallet modal
  const [showConnectWalletForVote, setShowConnectWalletForVote] = useState(false);

  // Update handleUpvoteClick function
  const handleUpvoteClick = async (e, idea) => {
    e.stopPropagation();
    if (isUpvoting) return;

    if (idea.hasUpvoted) {
      toast.error("You can only upvote once for an idea.");
      return;
    }

    if (!token) {
      setShowConnectWalletForVote(true);
      return;
    }
    try {
      setLoadingUpvotes(idea.id);

      setShowUpvoteConfirmation(true);
      setPendingUpvoteIdea(idea);
    } catch (error) {
      console.error("Error upvoting idea:", error);
      toast.error("Failed to upvote idea");
    } finally {
      setLoadingUpvotes(null);
    }
  };

  useEffect(() => {
    if (!isUpvoting) {
      setLoadingUpvotes(null);
    }
  }, [isUpvoting]);

  // Clean up
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  // Add handler for idea click
  const handleIdeaClick = (idea) => {
    if (isUpvoting) return;
    setSelectedIdea(idea);
  };

  // Add submit handler for new idea
  const { addIdea: handleAddIdea, isLoading: isAddingIdea } = useAddIdea({
    onSuccess: () => {
      setShowAddIdeaModal(false);
    },
  });

  // Update useIdeas hook usage
  const { data: ideasData, isLoading } = useIdeas({
    limit: itemsPerPage,
    page: currentPage,
    search: searchTerm,
    categoryId: selectedCategory === "all" ? "" : selectedCategory,
    orderBy: sortBy,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    address: tokenValid,
  });

  useEffect(() => {
    setTokenValid(token);
  }, [address, isLoggedIn]);

  useEffect(() => {
    if (ideasData) {
      setIdeas(ideasData.data.allIdeas);
      setTotalIdeas(Number(ideasData.data._allIdeasMeta.count));
    }
  }, [ideasData]);

  // Remove searchTimeout ref since we won't need it
  const [searchInput, setSearchInput] = useState("");

  // Update search handler to only update input
  const handleSearch = (event) => {
    setSearchInput(event.target.value);

    if (event.target.value === "") {
      setSearchTerm("");
      setCurrentPage(1);
    }
  };

  const handleSearchSubmit = (e) => {
    setSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Add confirmation handler
  const handleUpvoteConfirm = async () => {
    if (!pendingUpvoteIdea) return;

    try {
      setLoadingUpvotes(pendingUpvoteIdea.id);

      const isEnoughBalance = await checkEnoughBalance("0.01");
      if (!isEnoughBalance) return;

      const tx = await sendTransactionAsync({
        to: VOTE_RECEIVER_ADDRESS,
        value: parseEther("0.01"),
      });

      setShowUpvoteConfirmation(false); // Close modal after transaction is sent

      const transactionReceipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      if (transactionReceipt.status !== "success") {
        toast.error("Transaction failed");
        return;
      }

      await upvote({
        ideaId: pendingUpvoteIdea.id,
        transactionHash: tx,
      });
    } catch (error) {
      console.error("Error upvoting idea:", error);
      toast.error("Failed to upvote idea");
    } finally {
      setLoadingUpvotes(null);
      setPendingUpvoteIdea(null);
    }
  };

  useEffect(() => {
    let interval;
    if (loadingUpvotes) {
      interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
    } else {
      setLoadingDots("");
    }
    return () => clearInterval(interval);
  }, [loadingUpvotes]);

  return (
    <section className="py-16 px-4" id="WAGMICetner">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          <span className="">
            {ideasSection ? (
              ideasSection?.sectionName || ""
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div className="h-7 bg-gray-300 animate-pulse rounded-lg mb-3 w-[50%]"></div>
              </div>
            )}
          </span>
        </h2>
        <div className="text-gray-600 max-w-4xl mx-auto text-center mb-12">
          <p
            dangerouslySetInnerHTML={{
              __html: ideasSection?.sectionDescription || "",
            }}
          ></p>
        </div>

        <div className="flex md:flex-row justify-center items-start w-full md:gap-4 min-[320px]:gap-2">
          {/* Add search input */}
          <div className="lg:mb-8 relative w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearch}
                placeholder="Search ideas..."
                className="w-full block pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            <Button
              onClick={() => handleSearchSubmit()}
              className="h-[35px] absolute right-1 top-1/2 -translate-y-1/2 rounded-lg bg-black hover:bg-black/80 flex justify-center items-center"
            >
              <Search className="transform text-gray-400 w-5 h-5" />
            </Button>
          </div>
          {/* Add sort dropdown */}
          <Select value={sortBy} onValueChange={handleSort}>
            <SelectTrigger className="w-[180px] h-[42px] rounded-xl border-gray-300 bg-white font-medium min-[320px]:mb-8">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl bg-white">
              <SelectItem value="_publishedAt">Most Recent</SelectItem>
              <SelectItem value="upvote">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add category filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${selectedCategory === "all" ? "bg-[#E9D5FF] text-black" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            All Ideas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category.id ? "bg-[#E9D5FF] text-black" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : ideas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea, index) => (
              <div
                key={index}
                onClick={() => handleIdeaClick(idea)}
                className={`${bounties[index]?.bgColor ?? "bg-emerald-100"} ${
                  bounties[index]?.bgColor === "bg-black" && "text-white"
                } rounded-xl p-6 flex flex-col justify-between h-full cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="space-y-4 flex-1">
                  <h3 className="font-bold text-2xl">{idea.name}</h3>

                  <p className="text-sm opacity-80 line-clamp-3 overflow-hidden">{idea.description}</p>
                </div>

                <div className="pt-4 border-t border-black/10 mt-4">
                  <div className="flex items-center justify-between">
                    {/* <div>
                    <div className="text-xs opacity-70">{bounty.metric}</div>
                    <div className="font-bold">{bounty.value}</div>
                  </div> */}

                    <div className="flex items-center gap-6">
                      {/* <button 
                      onClick={() => handleIdeaClick(bounty.title)}
                      className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
                    >
                      <Lightbulb size={18} />
                      Ideas
                    </button>
                    <button 
                      onClick={() => handleBriefClick(bounty.title)}
                      className="flex items-center gap-2 text-sm font-medium hover:opacity-70"
                    >
                      <FileText size={18} />
                      Brief
                    </button> */}
                      <button
                        onClick={(e) => handleUpvoteClick(e, idea)}
                        className="flex items-center gap-2 text-sm font-medium hover:opacity-70 disabled:opacity-50"
                      >
                        <div>
                          <ThumbsUp
                            fill={`${idea.hasUpvoted ? (bounties[index]?.bgColor === "bg-black" ? "white" : "black") : "transparent"}`}
                            size={18}
                          />
                        </div>
                        {loadingUpvotes === idea.id ? (
                          <>
                            {/* <div
                              className={`animate-spin rounded-full h-4 w-4 border-b-2 ${
                                bounties[index]?.bgColor === "bg-black"
                                  ? "border-white"
                                  : "border-black"
                              }`}
                            ></div> */}
                            <p>Processing transaction{loadingDots}</p>
                          </>
                        ) : (
                          <>
                            {idea.upvote}
                            <p>Upvote</p>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
            <FileQuestion className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">No ideas found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
      {/* {selectedBountyData && (
        <IdeasModal 
          open={!!selectedBounty}
          onOpenChange={() => setSelectedBounty(null)}
          title={selectedBountyData.title}
          description={selectedBountyData.description}
          data={selectedBountyData.data}
        />
      )} */}
      {selectedBrief && (
        <BriefModal
          open={!!selectedBrief}
          onOpenChange={() => setSelectedBrief(null)}
          icon={<FileText className="w-6 h-6" />}
          header={briefData[selectedBrief].header}
          subheader={briefData[selectedBrief].subheader}
          introText={briefData[selectedBrief].introText}
          bodyText={briefData[selectedBrief].bodyText}
        />
      )}
      {/* Add AddIdeaModal */}
      <AddIdeaModal open={showAddIdeaModal} onOpenChange={setShowAddIdeaModal} categories={categories} onSubmit={handleAddIdea} />
      <UpvoteModal // Update 4
        open={isUpvoteModalOpen}
        onOpenChange={(open) => {
          console.log("UpvoteModal onOpenChange:", open); // Add this debug log
          setIsUpvoteModalOpen(open);
        }}
        projectTitle={selectedProjectTitle} // Update 4
      />{" "}
      {/* Add UpvoteModal */}
      {/* Add IdeaModal */}
      <IdeaModal open={!!selectedIdea} onOpenChange={(open) => !open && setSelectedIdea(null)} idea={selectedIdea} />
      <UpvoteConfirmationModal
        open={showUpvoteConfirmation}
        onOpenChange={(open) => {
          if (!open) {
            setPendingUpvoteIdea(null);
          }
          setShowUpvoteConfirmation(open);
        }}
        loadingUpvotes={loadingUpvotes}
        onConfirm={handleUpvoteConfirm}
      />
      <ConnectWalletModal
        open={showBalanceModal}
        onOpenChange={setShowBalanceModal}
        title="Insufficient COTI Balance"
        description="You need at least 0.01 COTI token in your wallet to upvote an idea. This helps prevent spam and ensures quality submissions."
        buttonText="Follow this instruction to get more COTI"
        handleChange={() => {
          setShowUpvoteConfirmation(false);
        }}
      />
      <ConnectWalletModal
        open={showConnectWalletForVote}
        onOpenChange={setShowConnectWalletForVote}
        title="Connect Wallet Required"
        description="Please connect to your wallet to add a vote"
        buttonText="Connect Wallet"
        isConnectWallet={true}
      />
      {/* Update pagination controls with shadcn/ui style */}
      <div className="mt-8 flex justify-center items-center gap-1">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 border"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-1">
          {[...Array(Math.ceil(totalIdeas / itemsPerPage))].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`rounded-xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 w-9 p-0 border ${
                currentPage === idx + 1
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage >= Math.ceil(totalIdeas / itemsPerPage)}
          className="rounded-xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0 border"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
