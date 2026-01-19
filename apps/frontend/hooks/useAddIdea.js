import { useState } from "react";
import { addIdea } from "@/lib/datocms";

export function useAddIdea({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddIdea = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      await addIdea(formData);
      onSuccess?.();
    } catch (error) {
      setError(error.message || "Failed to add idea");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addIdea: handleAddIdea,
    isLoading,
    error,
  };
}
