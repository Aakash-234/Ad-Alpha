import { useMutation } from "@tanstack/react-query";
import { postAnalyzeCompetitors, InputType as AnalyzeCompetitorsInput, OutputType as AnalyzeCompetitorsOutput } from "../endpoints/analyze-competitors_POST.schema";
import { toast } from "sonner";

export const COMPETITOR_ANALYSIS_QUERY_KEY = "competitorAnalysis";

/**
 * React Query hook for analyzing competitor creatives.
 * Provides a mutation function that can be called to trigger the analysis.
 * Handles loading, success, and error states, showing toasts to the user.
 */
export const useAnalyzeCompetitors = () => {
  return useMutation<AnalyzeCompetitorsOutput, Error, AnalyzeCompetitorsInput>({
    mutationKey: [COMPETITOR_ANALYSIS_QUERY_KEY],
    mutationFn: (input: AnalyzeCompetitorsInput) => postAnalyzeCompetitors(input),
    onSuccess: () => {
      toast.success("Competitor analysis complete!");
    },
    onError: (error) => {
      toast.error(`Analysis failed: ${error.message}`);
    },
  });
};