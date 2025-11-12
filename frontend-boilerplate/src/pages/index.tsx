import Head from "next/head";
import { useRouter } from "next/router";

import {
  Header,
  SearchBar,
  FeaturesSection,
  HeaderSession,
} from "@/components";
import type { Filters } from "@/components/common/search-bar/components";
import { stripMarkTags } from "@/utils/highlight";
import styles from "@/styles/Index.module.css";

export default function Search() {
  const router = useRouter();

  const handleSearch = (cnj: string, filters?: Filters) => {
    const query: { q?: string; court?: string; date?: string; dateOp?: string } = {};
    
    if (cnj) {
      query.q = stripMarkTags(cnj);
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

  return (
    <>
      <Head>
        <title>Consulta processual | Jusbrasil</title>
        <meta
          name="description"
          content="Consulta processual"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className={styles.page}>
        <Header />

        <main className={styles.main} role="main">
          <HeaderSession />
          <SearchBar onSearch={handleSearch} isLoading={false} />
          <FeaturesSection />
        </main>
      </div>
    </>
  );
}
