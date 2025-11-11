import Head from "next/head";
import { useRouter } from "next/router";

import {
  Header,
  SearchBar,
  FeaturesSection,
  HeaderSession,
} from "@/components";
import styles from "@/styles/Index.module.css";

export default function Search() {
  const router = useRouter();

  const handleSearch = (cnj: string, court: "ALL" | "TJAL" | "TJCE") => {
    const query: { q?: string; court?: string } = {};
    
    if (cnj) {
      query.q = cnj;
    }
    
    if (court !== "ALL") {
      query.court = court;
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
