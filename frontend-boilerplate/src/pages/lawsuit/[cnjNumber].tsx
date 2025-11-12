import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { Text } from "@radix-ui/themes";

import { Header, SearchBar, MovementSession, PartySession, DetailSession, LawyerSession, LawsuitHeader, OfferModal } from "@/components";
import type { Filters } from "@/components/common/search-bar/components";
import { useExperiment } from "@/hooks/useExperiment";
import { useNextPlanModal } from "@/hooks/useNextPlanModal";
import { SEARCH_LAWSUITS_QUERY } from "@/graphql/queries/lawsuit";
import { stripMarkTags } from "@/utils/highlight";
import styles from "@/styles/LawsuitDetail.module.css";

export default function LawsuitDetailPage() {
  const router = useRouter();
  const { cnjNumber, q } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<string>("");

  const cnjRaw = typeof cnjNumber === "string" ? decodeURIComponent(cnjNumber) : "";
  const cnj = stripMarkTags(cnjRaw);
  const originalQuery = typeof q === "string" ? q : null;

  // Use SEARCH_LAWSUITS_QUERY with generic query parameter
  // If we have original query (from search results), use it to preserve highlights
  // Otherwise, use the CNJ number directly 
  const queryVariables = {
    query: originalQuery || cnj,
  };

  const { data, loading, error } = useQuery(SEARCH_LAWSUITS_QUERY, {
    variables: queryVariables,
    skip: !cnj,
  });

  const { shouldBlockLastMovement, loading: experimentLoading } = useExperiment();
  const { modalData, loading: modalLoading } = useNextPlanModal();

  // If we have original query, filter results to find the specific lawsuit by CNJ
  // Otherwise, use the first result (should be the exact CNJ match)
  const lawsuit = originalQuery
    ? (data?.searchLawsuitsQuery || []).find((l) => stripMarkTags(l.number) === cnj) || null
    : data?.searchLawsuitsQuery?.[0] || null;

  const handleSearch = (searchCnj: string, filters?: Filters) => {
    const query: { q?: string; court?: string; date?: string; dateOp?: string } = {};
    
    if (searchCnj) {
      query.q = stripMarkTags(searchCnj);
    }
    
    if (filters?.court && filters.court !== "ALL") {
      query.court = filters.court;
    }

    if (filters?.date) {
      query.date = filters.date.date;
      query.dateOp = filters.date.operator;
    }

    router.push({
      pathname: "/search-results",
      query,
    });
  };

  const handleBlockedMovementClick = (movementId: string) => {
    setSelectedMovementId(movementId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Carregando processo... | Jusbrasil</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={styles.page}>
          <Header />
          <main className={styles.main}>
            <div className={styles.loading}>Carregando...</div>
          </main>
        </div>
      </>
    );
  }

  if (error || !lawsuit) {
    return (
      <>
        <Head>
          <title>Processo não encontrado | Jusbrasil</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <div className={styles.page}>
          <Header />
          <main className={styles.main}>
            <div className={styles.errorContainer}>
              <Text size="4" weight="bold">
                Processo não encontrado
              </Text>
              <Text size="3" color="gray">
                O processo solicitado não foi encontrado.
              </Text>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Processo {stripMarkTags(lawsuit.number)} | Jusbrasil</title>
        <meta
          name="description"
          content={`Detalhes do processo ${stripMarkTags(lawsuit.number)}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Header />

        <main className={styles.main} role="main">
          <div className={styles.searchBarContainer}>
            <SearchBar onSearch={handleSearch} isLoading={false} />
          </div>

          <LawsuitHeader
            number={lawsuit.number}
            court={lawsuit.court || ""}
            startDate={lawsuit.startDate || ""}
          />

          <div className={styles.contentGrid}>
            <div className={styles.movementsColumn}>
              <MovementSession
                movements={lawsuit.movements || []}
                shouldBlockLastMovement={shouldBlockLastMovement}
                onBlockedMovementClick={handleBlockedMovementClick}
              />
            </div>

            <div className={styles.detailsColumn}>
              <DetailSession lawsuit={lawsuit} />
              <PartySession parties={lawsuit.parties || []} />
              {lawsuit.lawyers && lawsuit.lawyers.length > 0 && (
                <LawyerSession lawyers={lawsuit.lawyers} />
              )}
            </div>
          </div>
        </main>
      </div>

      {modalData && !modalLoading && isModalOpen && selectedMovementId && (
        <OfferModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          modalData={modalData}
          lawsuitNumber={stripMarkTags(lawsuit.number)}
          movementId={selectedMovementId}
        />
      )}
    </>
  );
}

