import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";

import { Header, LawsuitsSearchSession, BackButton, ErrorSection, NotFoundSection, CollectionQueuedSection } from "@/components";
import type { Filters } from "@/components/common/search-bar/components";
import { getSearchVariables } from "@/utils/searchVariables";
import { SEARCH_LAWSUITS_QUERY } from "@/graphql/queries/lawsuit";
import type { Lawsuit } from "@/types/lawsuit";
import styles from "@/styles/SearchResults.module.css";

export default function SearchResultsPage() {
  const router = useRouter();
  const { q, court, date, dateOp } = router.query;

  const searchQuery = typeof q === "string" ? q : "";
  
  // Build filters from URL params
  const filters: Filters = {};
  const courtFilter = typeof court === "string" ? court : undefined;
  if (courtFilter && courtFilter !== "ALL") {
    filters.court = courtFilter as "TJAL" | "TJCE";
  }
  if (date && dateOp) {
    filters.date = {
      date: date as string,
      operator: dateOp as "<" | "=" | ">",
    };
  }

  const variables = getSearchVariables(searchQuery, filters);

  const hasFilters = filters.court || filters.date;
  const shouldSkip = !searchQuery && !hasFilters;

  const { data, loading, error } = useQuery(SEARCH_LAWSUITS_QUERY, {
    variables,
    skip: shouldSkip,
  });

  const results: Lawsuit[] = data?.searchLawsuitsQuery || [];
  
  // Check if we have a collection queued response
  const collectionQueued = results.find(
    (result) => result.__typename === "CollectionQueued" || result.status === "queued"
  );
  
  // Filter out collection queued responses to get actual lawsuits
  const lawsuits = results.filter(
    (result) => result.__typename === "Lawsuit" || (result.id && result.number)
  );
  
  const hasResults = lawsuits.length > 0;
  const hasSearchParams = searchQuery || hasFilters;
  const showNotFound = !loading && !error && hasSearchParams && !hasResults && !collectionQueued;

  const getErrorMessage = () => {
    if (!error) return undefined;
    
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      return error.graphQLErrors[0].message;
    }
       
    return error.message;
  };

  return (
    <>
      <Head>
        <title>Resultados da busca | Jusbrasil</title>
        <meta
          name="description"
          content="Resultados da busca de processos"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Header />

        <main className={styles.main} role="main">
          <BackButton />

          {error && <ErrorSection message={getErrorMessage()} />}

          {collectionQueued && (
            <CollectionQueuedSection
              message={collectionQueued.message || "Processo em coleta. Por favor, aguarde alguns minutos e tente novamente."}
              cnj={collectionQueued.cnj}
            />
          )}

          {showNotFound && <NotFoundSection />}

          {hasResults && (
            <LawsuitsSearchSession lawsuits={lawsuits} originalQuery={searchQuery} />
          )}
        </main>
      </div>
    </>
  );
}
