export type SupportBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "faq"; q: string; a: string }
  | { type: "issue"; title: string; items: string[] };

export type SupportSection = {
  id: string;
  title: string;
  blocks: SupportBlock[];
};

export type SupportCopy = {
  title: string;
  description: string;
  kicker: string;
  lead: string[];
  appStore: string;
  tocLabel: string;
  sections: SupportSection[];
};
