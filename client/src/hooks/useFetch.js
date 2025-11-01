import { getItem, getItems, getMatches } from '../api/items'
import { useQuery } from '@tanstack/react-query'

export function useFetchItem(type, entry_id) {
  const { data: formData, isPending, error } = useQuery({ 
    queryKey: [`${type}_item`, entry_id],
    queryFn: () => getItem(entry_id),
    staleTime: 10 * 60 * 100,
    enabled: !!entry_id,
    refetchOnWindowFocus: true,
  })

  return {
    formData,
    isPending,
    error
  }
}


export function useFetchItems(itemType, queryKey) {
  const { data, isPending, error } = useQuery({
    queryKey: [queryKey],
    queryFn: getItems,
    staleTime: 10 * 60 * 100, 
    refetchOnWindowFocus: true,
  });

  const entries = (data || []).filter((item) => item.type === itemType);

  return {
    entries,
    isPending,
    error,
  };
}


export function useFetchMatches(entry_id){
  const {data, isPending, error} = useQuery({
    queryKey: [`match_${entry_id}`],
    queryFn: () => getMatches(entry_id),
    staleTime: 10 * 60 * 500,
  })

  return {
    data,
    isPending,
    error
  }
}

