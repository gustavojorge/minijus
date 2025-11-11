export interface Party {
  name?: string;
  role?: string;
}

export interface Lawyer {
  name?: string;
}

export interface Movement {
  id?: string;
  date?: string;
  description?: string;
  lastInteractionDate?: string;
}

export interface Lawsuit {
  id: string;
  number: string;
  parties?: Party[];
  court?: string;
  startDate?: string;
  movements?: Movement[];
  nature?: string;
  kind?: string;
  subject?: string;
  judge?: string;
  value?: number;
  lawyers?: Lawyer[];
}

