import { Text } from "@radix-ui/themes";

import { Movement } from "@/types";
import { MovementItem } from "./components/MovementItem";
import styles from "./MovementSession.module.css";

interface MovementSessionProps {
  movements: Movement[];
  shouldBlockLastMovement?: boolean;
  onBlockedMovementClick?: (movementId: string) => void;
}

export function MovementSession({
  movements,
  shouldBlockLastMovement = false,
  onBlockedMovementClick,
}: MovementSessionProps) {
  return (
    <div className={styles.movementSession}>
      <div className={styles.sectionHeader}>
        <Text size="4" weight="bold">
          Movimentações
        </Text>
      </div>
      <div className={styles.movementsList}>
        {movements.length > 0 ? (
          movements.map((movement, index) => {
            const isFirstMovement = index === 0;
            const isBlocked = shouldBlockLastMovement && isFirstMovement;

            return (
              <MovementItem
                key={movement.id || `movement-${index}`}
                date={movement.date || undefined}
                description={movement.description || undefined}
                isBlocked={isBlocked}
                onBlockedClick={
                  isBlocked && onBlockedMovementClick && movement.id
                    ? () => onBlockedMovementClick(movement.id!)
                    : undefined
                }
              />
            );
          })
        ) : (
          <Text size="3" color="gray">
            Nenhuma movimentação encontrada.
          </Text>
        )}
      </div>
    </div>
  );
}

