import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postUploadManualCreative, InputType as UploadManualCreativeInput } from "../endpoints/upload-manual-creative_POST.schema";
import { toast } from "sonner";
import { CREATIVES_QUERY_KEY } from "./creativesApi";

/**
 * React Query hook for manually uploading creative images.
 * This mutation handles FormData submission to the `upload-manual-creative` endpoint.
 * It provides UI feedback via toasts and invalidates the creatives query on success
 * to refresh the list of creatives.
 */
export const useUploadManualCreative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: UploadManualCreativeInput) => postUploadManualCreative(formData),
    onSuccess: (data) => {
      toast.success(`${data.length} creative(s) uploaded successfully!`);
      queryClient.invalidateQueries({ queryKey: [CREATIVES_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Manual creative upload failed:", error);
      if (error instanceof Error) {
        toast.error(`Upload failed: ${error.message}`);
      } else {
        toast.error("An unknown error occurred during upload.");
      }
    },
  });
};