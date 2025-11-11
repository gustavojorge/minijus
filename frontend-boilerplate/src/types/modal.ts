export interface NextPlanModalData {
  header: {
    title: string;
    subtitle: string;
  };
  body: {
    benefits: string[];
    price: {
      current: string;
      next: string;
      period: string;
    };
    button: {
      label: string;
    };
  };
  footer: {
    text: string;
  };
}

