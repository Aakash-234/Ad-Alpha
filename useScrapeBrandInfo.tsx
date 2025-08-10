import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { postScrapeBrandInfo, InputType, OutputType } from "../endpoints/scrape-brand-info_POST.schema";

type UseScrapeBrandInfoOptions = Omit<
  UseMutationOptions<OutputType, Error, InputType>,
  'mutationFn'
>;

export const useScrapeBrandInfo = (options?: UseScrapeBrandInfoOptions) => {
  return useMutation<OutputType, Error, InputType>({
    mutationFn: (data: InputType) => postScrapeBrandInfo(data),
    ...options,
  });
};