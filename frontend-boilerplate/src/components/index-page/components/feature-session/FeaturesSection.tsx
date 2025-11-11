import { MagnifyingGlassIcon, FileTextIcon, CheckIcon } from "@radix-ui/react-icons";

import { FeatureItem } from "./components/feature-item";
import styles from "./FeaturesSection.module.css";

export function FeaturesSection() {
  const features = [
    {
      icon: <MagnifyingGlassIcon width={32} height={32} />,
      description: "Encontre processos pelo CNJ",
    },
    {
      icon: <FileTextIcon width={32} height={32} />,
      description: "Acesse as movimentações e outras informações do processo",
    },
    {
      icon: <CheckIcon width={32} height={32} />,
      description: "Filtre por tribunal (TJAL ou TJCE)",
    },
  ];

  return (
    <section className={styles.features} aria-labelledby="features-title">
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <FeatureItem
            key={index}
            icon={feature.icon}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
}

