import { useQueryClient, useMutation } from "@tanstack/react-query"
import { setMatch } from "../api/items"
import { useNavigate } from "react-router-dom"

export function usematchItems() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({lostentry_id, foundentry_id, similarity}) => setMatch(lostentry_id, foundentry_id, similarity),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"])
      alert("Found Item Claim Requested!")
      navigate(`/user/lost-entries`)
    },
    onError: () => {
      alert("Failed Request Claim.")
    },
  })
}