import styles from "./HeaderSession.module.css";

export function HeaderSession() {
  return (
    <div className={styles.headerSession}>
      <h1 id="main-title" className={styles.title}>
        Consulta processual
      </h1>
      
      <p id="search-description" className={styles.searchDescription}>
        Consultar processos por CNJ e tribunal
      </p>
    </div>
  );
}

