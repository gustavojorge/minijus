import { useQuery } from "@apollo/client";
import { GET_NEXT_PLAN_MODAL } from "@/graphql/queries/experiment";
import { NextPlanModalData } from "@/types";

export function useNextPlanModal() {
  const { data, loading, error } = useQuery(GET_NEXT_PLAN_MODAL, {
    fetchPolicy: "cache-first",
  });

  return {
    modalData: data?.nextPlanModalQuery as NextPlanModalData | undefined,
    loading,
    error: error as Error | undefined,
  };
}

