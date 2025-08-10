import { useQuery } from "@tanstack/react-query";
import { getRegionalProfiles } from "../endpoints/regional-profiles_GET.schema";

export const REGIONAL_PROFILES_QUERY_KEY = "regionalProfiles";

/**
 * React Query hook to fetch all regional profiles.
 */
export const useGetRegionalProfiles = () => {
  return useQuery({
    queryKey: [REGIONAL_PROFILES_QUERY_KEY],
    queryFn: () => getRegionalProfiles(),
  });
};