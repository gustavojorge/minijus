import styles from "./ErrorSection.module.css";

interface ErrorSectionProps {
  message?: string;
}

export function ErrorSection({ message }: ErrorSectionProps) {
  const defaultMessage = "Erro ao carregar resultados. Por favor, tente novamente.";
  
  return (
    <div className={styles.errorMessage} role="alert" aria-live="assertive">
      <p>{message || defaultMessage}</p>
    </div>
  );
}

