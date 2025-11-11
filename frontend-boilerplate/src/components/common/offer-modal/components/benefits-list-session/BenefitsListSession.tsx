import { CheckIcon } from "@radix-ui/react-icons";
import styles from "./BenefitsListSession.module.css";

interface BenefitsListSessionProps {
  benefits: string[];
}

export function BenefitsListSession({ benefits }: BenefitsListSessionProps) {
  return (
    <ul className={styles.benefitsList}>
      {benefits.map((benefit, index) => (
        <li key={index} className={styles.benefitItem}>
          <CheckIcon className={styles.checkIcon} />
          <span>{benefit}</span>
        </li>
      ))}
    </ul>
  );
}

