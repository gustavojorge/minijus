import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";
import { useState } from "react";
import { Text } from "@radix-ui/themes";

import { Header, SearchBar, MovementSession, PartySession, DetailSession, LawsuitHeader, OfferModal } from "@/components";
import { useExperiment } from "@/hooks/useExperiment";
import { useNextPlanModal } from "@/hooks/useNextPlanModal";
import { GET_LAWSUIT_BY_NUMBER_QUERY } from "@/graphql/queries/lawsuit";
import styles from "@/styles/LawsuitDetail.module.css";

export default function LawsuitDetailPage() {
  const router = useRouter();
  const { cnjNumber } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<string>("");

  const cnj = typeof cnjNumber === "string" ? decodeURIComponent(cnjNumber) : "";

  const { data, loading, error } = useQuery(GET_LAWSUIT_BY_NUMBER_QUERY, {
    variables: { number: cnj },
    skip: !cnj,
  });

  const { shouldBlockLastMovement, loading: experimentLoading } = useExperiment();
  const { modalData, loading: modalLoading } = useNextPlanModal();

  const lawsuit = data?.searchLawsuitsQuery?.[0] || null;

  const handleSearch = (searchCnj: string, court: "ALL" | "TJAL" | "TJCE") => {
    const query: { q?: string; court?: string } = {};
    
    if (searchCnj) {
      query.q = searchCnj;
    }
    
    if (court !== "ALL") {
      query.court = court;
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
        <title>Processo {lawsuit.number} | Jusbrasil</title>
        <meta
          name="description"
          content={`Detalhes do processo ${lawsuit.number}`}
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
            court={lawsuit.court}
            startDate={lawsuit.startDate}
          />

          <div className={styles.contentGrid}>
            <div className={styles.movementsColumn}>
              <MovementSession
                movements={lawsuit.movements}
                shouldBlockLastMovement={shouldBlockLastMovement}
                onBlockedMovementClick={handleBlockedMovementClick}
              />
            </div>

            <div className={styles.detailsColumn}>
              <DetailSession lawsuit={lawsuit} />
              <PartySession parties={lawsuit.parties} />
            </div>
          </div>
        </main>
      </div>

      {modalData && !modalLoading && isModalOpen && selectedMovementId && (
        <OfferModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          modalData={modalData}
          lawsuitNumber={lawsuit.number}
          movementId={selectedMovementId}
        />
      )}
    </>
  );
}

