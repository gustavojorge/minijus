import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";
import styles from "./HeaderSession.module.css";

interface HeaderSessionProps {
  onClose: () => void;
}

export function HeaderSession({ onClose }: HeaderSessionProps) {
  return (
    <div className={styles.modalHeader}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Fechar modal"
      >
        <Cross2Icon width={20} height={20} />
      </button>

      <div className={styles.logo}>
        <Image
          src="/jus_icon.png"
          alt="Jusbrasil"
          width={32}
          height={32}
          className={styles.logoImage}
        />
      </div>
    </div>
  );
}

