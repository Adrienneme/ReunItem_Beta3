// useApproveClaim.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveClaimRequest } from "../api/admin"; // your existing function

export function useApproveClaim() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (match_id) => approveClaimRequest(match_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"]);
      queryClient.invalidateQueries(["found_items"]);
      queryClient.invalidateQueries(["lost_item"]);
      queryClient.invalidateQueries(["found_item"]);
      alert("Claim approved and items marked as Claimed!");
    },
    onError: (error) => {
      alert(
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to approve claim."
      );
    },
  });
}
