import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postUploadImage, OutputType } from "../endpoints/upload-image_POST.schema";

type UploadApiError = Error;

// The mutation function expects a single File object
type MutationVariables = File;

export const useUploadImage = (
  options?: Omit<UseMutationOptions<OutputType, UploadApiError, MutationVariables>, 'mutationFn'>
) => {
  return useMutation<OutputType, UploadApiError, MutationVariables>({
    mutationFn: async (file: MutationVariables) => {
      const formData = new FormData();
      formData.append('file', file);
      return postUploadImage(formData);
    },
    ...options,
  });
};