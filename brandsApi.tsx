import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postBrands, InputType as CreateBrandInput } from "../endpoints/brands_POST.schema";
import { getBrands } from "../endpoints/brands_GET.schema";
import { toast } from "sonner";

export const BRANDS_QUERY_KEY = "brands";

/**
 * React Query hook to fetch all brands.
 */
export const useGetBrands = () => {
  return useQuery({
    queryKey: [BRANDS_QUERY_KEY],
    queryFn: () => getBrands(),
  });
};

/**
 * React Query hook for creating a new brand.
 * Handles mutation logic, including optimistic updates and cache invalidation.
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newBrand: CreateBrandInput) => postBrands(newBrand),
    onSuccess: () => {
      toast.success("Brand created successfully!");
      // Invalidate the brands query to refetch the list with the new brand
      queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(`Failed to create brand: ${error.message}`);
    },
  });
};