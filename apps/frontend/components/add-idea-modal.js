import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import useAuth from "@/hooks/useAuth";
import ConnectWalletModal from "./connect-wallet-modal";

const schema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  category: yup.string().required("Category is required"),
});

export default function AddIdeaModal({
  open,
  onOpenChange,
  categories,
  onSubmit,
  data,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: data || "",
      description: "",
      category: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
  });
  const { isLoggedIn } = useAuth();

  // Update useEffect to handle data prop changes
  useEffect(() => {
    if (data) {
      setValue("name", data);
    }
  }, [data, setValue]);

  // Add new state
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const onSubmitForm = async (data) => {
    if (!isLoggedIn) return;
    const fomattedBalance = Number(formatUnits(balance.value, 18));
    if (Number(fomattedBalance) < 1) {
      setShowBalanceModal(true);
      return;
    }
    setLoading(true);
    try {
      await onSubmit(data);
      toast.success("Idea submitted successfully!");
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting idea:", error);
      toast.error("Failed to submit idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px] rounded-xll">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Add A New Idea</DialogTitle>
            <button onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <Separator className="my-1 h-[1px] bg-gray-200" />
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter idea name"
                {...register("name")}
                className={`border-gray-300 rounded-[8px] ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter idea description"
                {...register("description")}
                className={`min-h-[100px] border-gray-300 rounded-[8px] ${
                  errors.description ? "border-red-500" : ""
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => {
                  setValue("category", value);
                  clearErrors("category");
                }}
                {...register("category")}
              >
                <SelectTrigger
                  id="category"
                  className={`border-gray-300 rounded-[8px] ${
                    errors.category ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="border-gray-300 rounded-[8px] bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>
            <Separator className="my-1 h-[1px] bg-gray-200" />
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-black hover:bg-black/50 text-white rounded-xl"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConnectWalletModal
        open={showBalanceModal}
        onOpenChange={setShowBalanceModal}
        title="Insufficient COTI Balance"
        description="You need at least 1 COTI token in your wallet to submit an idea. This helps prevent spam and ensures quality submissions."
      />
    </>
  );
}
