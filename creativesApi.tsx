import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postGenerateCreative, InputType as GenerateCreativeInput } from "../endpoints/generate-creative_POST.schema";
import { toast } from "sonner";

export const CREATIVES_QUERY_KEY = "creatives";

/**
 * React Query hook for generating a new creative.
 */
export const useGenerateCreative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: GenerateCreativeInput) => postGenerateCreative(input),
    onSuccess: () => {
      toast.success("New creative generated!");
      // In a real app, you would likely have a query for creatives to invalidate.
      // For example: queryClient.invalidateQueries({ queryKey: [CREATIVES_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(`Failed to generate creative: ${error.message}`);
    },
  });
};