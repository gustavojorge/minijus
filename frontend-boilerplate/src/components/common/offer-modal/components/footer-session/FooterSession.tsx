import styles from "./FooterSession.module.css";

interface FooterSessionProps {
  text: string;
}

export function FooterSession({ text }: FooterSessionProps) {
  return <p className={styles.footerText}>{text}</p>;
}

