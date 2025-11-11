import { Lawsuit } from "@/types";
import styles from "./lawsuits-search-session.module.css";
import { LawsuitSearchItem } from "./components";

interface LawsuitsSearchSessionProps {
  lawsuits: Lawsuit[];
}

export function LawsuitsSearchSession({ lawsuits }: LawsuitsSearchSessionProps) {
  return (
    <section className={styles.container} aria-label="Resultados da busca">
      <h2 className={styles.title}>
        {lawsuits.length} processo{lawsuits.length !== 1 ? "s" : ""} encontrado
        {lawsuits.length !== 1 ? "s" : ""}
      </h2>
      <div className={styles.resultsList} role="list">
        {lawsuits.map((lawsuit) => (
          <LawsuitSearchItem key={lawsuit.id} lawsuit={lawsuit} />
        ))}
      </div>
    </section>
  );
}

