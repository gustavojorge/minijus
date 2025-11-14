import { Text, Button } from "@radix-ui/themes";
import { useRouter } from "next/router";
import styles from "./CollectionQueuedSection.module.css";

interface CollectionQueuedSectionProps {
  message?: string;
  cnj?: string;
}

export function CollectionQueuedSection({ message, cnj }: CollectionQueuedSectionProps) {
  const router = useRouter();

  const handleRetry = () => {
    // Reload the page to retry the search
    router.reload();
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Text size="5" weight="bold" className={styles.title}>
          Processo em coleta
        </Text>
        <Text size="3" color="gray" className={styles.message}>
          {message || "O processo não foi encontrado no momento. Iniciamos a coleta dos dados e ele estará disponível em breve."}
        </Text>
        {cnj && (
          <Text size="2" color="gray" className={styles.cnj}>
            CNJ: {cnj}
          </Text>
        )}
        <Text size="2" color="gray" className={styles.instruction}>
          Por favor, aguarde alguns minutos e tente novamente. O processo está sendo coletado e será indexado em breve.
        </Text>
        <Button
          onClick={handleRetry}
          color="jade"
          size="3"
          className={styles.retryButton}
        >
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

