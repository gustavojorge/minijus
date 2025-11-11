import { Button } from "@radix-ui/themes";
import { useRouter } from "next/router";

import styles from "./BackButton.module.css";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href = "/", label = "Voltar" }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      color="jade"
      onClick={() => router.push(href)}
      className={styles.backButton}
    >
      {label}
    </Button>
  );
}

