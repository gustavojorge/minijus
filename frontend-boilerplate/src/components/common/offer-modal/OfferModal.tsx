import { Button, Dialog } from "@radix-ui/themes";
import { useMutation } from "@apollo/client";

import { REGISTER_LAST_INTERACTION } from "@/graphql/mutations/experiment";
import { NextPlanModalData } from "@/types";
import {
  HeaderSession,
  BenefitsListSession,
  PriceSession,
  FooterSession,
} from "./components";
import styles from "./OfferModal.module.css";

interface OfferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modalData: NextPlanModalData;
  lawsuitNumber: string;
  movementId: string;
}

export function OfferModal({
  open,
  onOpenChange,
  modalData,
  lawsuitNumber,
  movementId,
}: OfferModalProps) {
  const [registerInteraction] = useMutation(REGISTER_LAST_INTERACTION);

  const handleSubscribe = async () => {
    try {
      // Register interaction when subscribing
      await registerInteraction({
        variables: {
          lawsuitNumber,
          movementId,
        },
      });
      onOpenChange(false);

    } catch (error) {
      console.error("Error registering interaction:", error);
    }
  };

  const handleClose = async () => {
    try {
      // Register interaction when closing the modal
      await registerInteraction({
        variables: {
          lawsuitNumber,
          movementId,
        },
      });
    } catch (error) {
      console.error("Error registering interaction:", error);
    }
  };

  if (!modalData) {
    return null;
  }

  const handleOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      await handleClose();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Content className={styles.modalContent} size="4">
        <HeaderSession onClose={() => handleOpenChange(false)} />

        <div className={styles.modalBody}>
          <Dialog.Title className={styles.title}>{modalData.header.title}</Dialog.Title>
          <p className={styles.subtitle}>{modalData.header.subtitle}</p>

          <BenefitsListSession benefits={modalData.body.benefits} />

          <PriceSession
            current={modalData.body.price.current}
            next={modalData.body.price.next}
            period={modalData.body.price.period}
          />

          <Button
            size="3"
            className={styles.subscribeButton}
            onClick={handleSubscribe}
          >
            {modalData.body.button.label}
          </Button>

          <FooterSession text={modalData.footer.text} />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

