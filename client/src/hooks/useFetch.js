import { getItem, getItems, getMatch, getMatches } from '../api/items'
import { getUser } from '../api/users';
import { useQuery } from '@tanstack/react-query'

export function useFetchItem(type, entry_id) {
  const {
    data: formData,
    isPending: itemPending,
    error: itemError
  } = useQuery({
    queryKey: [`${type}_item`, entry_id],
    queryFn: () => getItem(entry_id),
    staleTime: 10 * 60 * 100,
    enabled: !!entry_id,
    refetchOnWindowFocus: true,
  });

  const userID = formData?.user_id;

  const {
    data: userData,
    isPending: userPending,
    error: userError
  } = useQuery({
    queryKey: ["user", userID],
    queryFn: () => getUser(userID),
    enabled: !!userID,
  });

  return {
    formData,
    user: userData?.data?.[0] || null,
    isPending: itemPending || userPending,
    error: itemError || userError,
  };
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
  const {data: formData = [], isPending, error} = useQuery({
    queryKey: [`match_${entry_id}`],
    queryFn: () => getMatches(entry_id),
    staleTime: 10 * 60 * 500,
  })

  return {
    formData,
    isPending,
    error
  }
}


export function useFetchMatched(entry_id){
  const {data, isPending, error} = useQuery({
    queryKey: [`matched_${entry_id}`],
    queryFn: () => getMatch(entry_id),
    staleTime: 10 * 60 * 100,
  })

  return{
    data,
    isPending,
    error
  }
}




