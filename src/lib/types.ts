export type CoachRow = {
  conference: string;
  school: string;

  // Friendly names used by upgraded UI
  website?: string;
  questionnaire?: string;
  staff?: string;

  // Original names kept for compatibility
  schoolWebsite?: string;
  recruitingQuestionnaire?: string;
  staffDirectory?: string;

  // Optional future fields
  headCoach?: string;
  email?: string;
  phone?: string;
};

export type TabKey =
  | "FBS"
  | "FCS"
  | "DII"
  | "DIII"
  | "NAIA"
  | "Sprint"
  | "JuCo"
  | "Post-Graduate"
  | "Canada"
  | "Womens Flag";
