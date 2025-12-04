type Attorney = {
  id: number
  name: string
  content: {
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