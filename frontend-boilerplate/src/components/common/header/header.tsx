import { Button } from "@radix-ui/themes";
import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.css";

export function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="Jusbrasil - Página inicial">
          <Image
            src="/jus_logo.png"
            alt="Jusbrasil Logo"
            width={150}
            height={40}
            priority
            className={styles.logoFull}
          />
          <Image
            src="/jus_icon.png"
            alt="Jusbrasil"
            width={40}
            height={40}
            priority
            className={styles.logoIcon}
          />
        </Link>
        <nav className={styles.nav} role="navigation" aria-label="Navegação principal">
          <Button
            variant="outline"
            color="jade"
            size="3"
            asChild
            className={styles.button}
          >
            <Link href="/" aria-label="Cadastre-se na plataforma">
              Cadastre-se
            </Link>
          </Button>
          <Button
            variant="outline"
            color="gray"
            size="3"
            asChild
            className={styles.button}
          >
            <Link href="/" aria-label="Entrar na sua conta">
              Entrar
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

