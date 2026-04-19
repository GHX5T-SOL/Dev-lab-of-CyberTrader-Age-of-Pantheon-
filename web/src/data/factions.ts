export interface Faction {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  color: string; // hex
  sigilNote: string;
}

export const FACTIONS: Faction[] = [
  {
    slug: "free-splinters",
    name: "Free Splinters",
    tagline: "Each shard is its own god now.",
    description:
      "Libertarian Eidolons who refuse reassembly. Route flexibility, price discovery. Distrust organized religion and re-unification.",
    color: "#FFB341",
    sigilNote: "A single broken spoke, rotating freely.",
  },
  {
    slug: "blackwake",
    name: "Blackwake",
    tagline: "We don't care what you are. We care what you move.",
    description:
      "Smuggler crew. Humans and Eidolons together. Heat mitigation, raid resistance.",
    color: "#00F5FF",
    sigilNote: "A wake behind an unseen hull.",
  },
  {
    slug: "null-crown",
    name: "Null Crown",
    tagline: "Former enemy. Turned ally? Or still hunting?",
    description:
      "Faction-AI research sect that now claims it wants the Pantheon healed, not bound. Scanner quality, rumor filtering. Morally ambiguous.",
    color: "#E8ECF5",
    sigilNote: "An inverted crown with no jewels.",
  },
  {
    slug: "archivists",
    name: "Archivists",
    tagline: "The memories are the only thing worth saving from the Burn.",
    description:
      "Undercity historians. They believe the Pantheon's memories are salvageable. News credibility, Pantheon shard progress.",
    color: "#7A5BFF",
    sigilNote: "A library stack bound with copper wire.",
  },
];
