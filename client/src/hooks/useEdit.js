import { useQueryClient, useMutation } from "@tanstack/react-query"
import { updateItem, deleteItem, delClaim } from "../api/items"
import { useNavigate } from "react-router-dom"

export function useDeleteItem(type) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (entry_id) => deleteItem(entry_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"])
      queryClient.invalidateQueries(["found_items"])
      alert("Entry deleted successfully!")
      navigate(`/user/${type}-entries`)
    },
    onError: () => {
      alert("Failed to delete.")
    },
  })
}


export function useUpdateItem(type) {
  const queryClient = useQueryClient()
  const navigate = useNavigate() 

  return useMutation({
    mutationFn: ({ entry_id, formData }) => updateItem(entry_id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"])
      queryClient.invalidateQueries(["found_items"])
      queryClient.invalidateQueries(["lost_item"])
      queryClient.invalidateQueries(["found_item"])
      alert("Updated Successfully!")
      navigate(`/user/${type}-entries`)
    },
    onError: () => {
      alert("Failed to update item.")
    },
  })
}

export function useCancelClaim(type){
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (entry_id) => delClaim(entry_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["lost_items"])
      queryClient.invalidateQueries(["found_items"])
      alert("Claim Canceled successfully!")
      navigate(`/user/${type}-entries`)
    },
    onError: () => {
      alert("Failed to Cancel.")
    },
  })
}