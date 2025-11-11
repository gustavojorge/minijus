import { Text } from "@radix-ui/themes";

import styles from "./MovementItem.module.css";

interface MovementItemProps {
  date: string;
  description: string;
  isBlocked?: boolean;
  onBlockedClick?: () => void;
}

export function MovementItem({
  date,
  description,
  isBlocked = false,
  onBlockedClick,
}: MovementItemProps) {
  const handleClick = () => {
    if (isBlocked && onBlockedClick) {
      onBlockedClick();
    }
  };

  return (
    <div
      className={`${styles.movementItem} ${isBlocked ? styles.blocked : ""}`}
      onClick={handleClick}
    >
      <Text size="2" weight="medium" color="gray" className={styles.movementDate}>
        {new Date(date).toLocaleDateString("pt-BR")}
      </Text>
      {isBlocked ? (
        <div className={styles.blockedContent}>
          <Text size="3" className={styles.blockedMessage}>
            Para ver informações mais atualizadas deste processo, assine agora.
          </Text>
          <Text size="2" weight="medium" className={styles.blockedCta}>
            Clique para ver oferta
          </Text>
        </div>
      ) : (
        <Text size="3" className={styles.movementDescription}>
          {description}
        </Text>
      )}
    </div>
  );
}

