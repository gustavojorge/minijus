import { useQuery } from "@apollo/client";
import { GET_EXPERIMENT_DATA } from "@/graphql/queries/experiment";

interface ExperimentData {
  alternative: {
    name: string;
  };
  client_id: string;
  experiment: {
    name: string;
  };
  experiment_group: {
    name: string;
  };
  participating: boolean;
  simulating: boolean;
  status: string;
}

interface UseExperimentResult {
  experimentData: ExperimentData | null;
  loading: boolean;
  error: Error | undefined;
  isParticipating: boolean;
  shouldBlockLastMovement: boolean;
}

const EXPERIMENT_NAME = "litigants-experiment";
const VARIANT_NAME = "variant-a"; // Variant that blocks the last movement

export function useExperiment(): UseExperimentResult {
  const { data, loading, error } = useQuery(GET_EXPERIMENT_DATA, {
    fetchPolicy: "cache-first",
  });

  const experimentData = data?.experimentDataQuery || null;

  const isParticipating =
    experimentData?.participating === true &&
    experimentData?.experiment?.name === EXPERIMENT_NAME &&
    experimentData?.alternative?.name === VARIANT_NAME;

  const shouldBlockLastMovement = isParticipating;

  console.log({
    shouldBlockLastMovement,
    isParticipating,
    experimentData: experimentData ? {
      experiment: experimentData.experiment?.name,
      alternative: experimentData.alternative?.name,
      participating: experimentData.participating,
      status: experimentData.status,
    } : null,
    loading,
  });

  return {
    experimentData,
    loading,
    error: error as Error | undefined,
    isParticipating,
    shouldBlockLastMovement,
  };
}

