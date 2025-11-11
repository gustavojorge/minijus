import styles from "./PriceSession.module.css";

interface PriceSessionProps {
  current: string;
  next: string;
  period: string;
}

export function PriceSession({ current, next, period }: PriceSessionProps) {
  return (
    <div className={styles.pricingSection}>
      <p className={styles.priceLabel}>
        de <span className={styles.originalPrice}>{next}</span> por:
      </p>
      <p className={styles.discountedPrice}>{current}</p>
      <p className={styles.pricePeriod}>{period}</p>
    </div>
  );
}

