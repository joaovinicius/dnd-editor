type BelongsTo = Record<string, string | number | boolean>;

type Metadata = {
  belongs_to: BelongsTo[];
};

type Attorney = {
  id: number
  name: string
  created_at: Date
  updated_at: Date | null
  deleted_at: Date | null
  published_at: Date | null
  content: {
    metadata: Metadata;
    data: {
      degree: string;
      picture: string;
      profile: string;
      settlements: {
        amount: number;
        claim_type: string;
      }[];
    };
  };
};


export type { Attorney };