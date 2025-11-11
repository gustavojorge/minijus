import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Head from "next/head";

import { Header, LawsuitsSearchSession, BackButton, ErrorSection, NotFoundSection } from "@/components";
import { getSearchVariables } from "@/utils/searchVariables";
import { SEARCH_LAWSUITS_QUERY } from "@/graphql/queries/lawsuit";
import styles from "@/styles/SearchResults.module.css";

export default function SearchResultsPage() {
  const router = useRouter();
  const { q, court } = router.query;

  const searchQuery = typeof q === "string" ? q : "";
  const courtFilter = typeof court === "string" ? court : undefined;
  const variables = getSearchVariables(searchQuery, courtFilter);

  const shouldSkip = !searchQuery && (!courtFilter || courtFilter === "ALL");

  const { data, loading, error } = useQuery(SEARCH_LAWSUITS_QUERY, {
    variables,
    skip: shouldSkip,
  });

  const lawsuits = data?.searchLawsuitsQuery || [];
  const hasResults = lawsuits.length > 0;
  const hasSearchParams = searchQuery || (courtFilter && courtFilter !== "ALL");
  const showNotFound = !loading && !error && hasSearchParams && !hasResults;

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

          {showNotFound && <NotFoundSection />}

          {hasResults && (
            <LawsuitsSearchSession lawsuits={lawsuits} originalQuery={searchQuery} />
          )}
        </main>
      </div>
    </>
  );
}
