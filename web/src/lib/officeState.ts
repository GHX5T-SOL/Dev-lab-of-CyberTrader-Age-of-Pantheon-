import { randomUUID } from "crypto";
import { BIBLE_INTRO } from "@/data/bible";
import { COMMODITIES } from "@/data/commodities";
import { OPENCLAW_AGENT_STATUS, OPENCLAW_NODE } from "@/data/openclaw";
import { PERFORMERS } from "@/data/performers";
import { ROADMAP } from "@/data/roadmap";
import { STATUS } from "@/data/status";
import { TASKS } from "@/data/tasks";
import { TEAM } from "@/data/team";
import { PROTOTYPES } from "@/data/wireframes";
import { OFFICE_DISTRICTS, OFFICE_HOTSPOTS } from "@/data/officeGame";
import { getSpendReport, type SpendReport } from "@/lib/spend";

export interface OfficeMessage {
  id: string;
  from: "ghost" | "zoro";
  to: string;
  message: string;
  createdAt: string;
}

export interface OfficePreference {
  founder: "ghost" | "zoro";
  graphicsPreset: "cinematic" | "balanced" | "performance";
  mobileObserver: boolean;
  savedAt: string;
}

export interface OfficeStatePayload {
  at: string;
  districts: typeof OFFICE_DISTRICTS;
  hotspots: typeof OFFICE_HOTSPOTS;
  tasks: typeof TASKS;
  prototypes: typeof PROTOTYPES;
  commodities: typeof COMMODITIES;
  performers: typeof PERFORMERS;
  team: typeof TEAM;
  roadmap: typeof ROADMAP;
  status: typeof STATUS;
  openclawNode: typeof OPENCLAW_NODE;
  openclawAgents: typeof OPENCLAW_AGENT_STATUS;
  bibleIntro: typeof BIBLE_INTRO;
  spend: SpendReport | null;
  messages: OfficeMessage[];
}

interface OfficeRuntimeStore {
  messages: OfficeMessage[];
  preferences: Record<string, OfficePreference>;
}

declare global {
  // eslint-disable-next-line no-var
  var __officeRuntimeStore: OfficeRuntimeStore | undefined;
}

function getStore(): OfficeRuntimeStore {
  if (!globalThis.__officeRuntimeStore) {
    globalThis.__officeRuntimeStore = {
      messages: [],
      preferences: {},
    };
  }
  return globalThis.__officeRuntimeStore;
}

export async function getOfficeState(): Promise<OfficeStatePayload> {
  let spend: SpendReport | null = null;
  try {
    spend = await getSpendReport();
  } catch {
    spend = null;
  }

  return {
    at: new Date().toISOString(),
    districts: OFFICE_DISTRICTS,
    hotspots: OFFICE_HOTSPOTS,
    tasks: TASKS,
    prototypes: PROTOTYPES,
    commodities: COMMODITIES,
    performers: PERFORMERS,
    team: TEAM,
    roadmap: ROADMAP,
    status: STATUS,
    openclawNode: OPENCLAW_NODE,
    openclawAgents: OPENCLAW_AGENT_STATUS,
    bibleIntro: BIBLE_INTRO,
    spend,
    messages: getStore().messages.slice(-80).reverse(),
  };
}

export function listOfficeMessages() {
  return getStore().messages.slice().reverse();
}

export function createOfficeMessage(input: Pick<OfficeMessage, "from" | "to" | "message">) {
  const message: OfficeMessage = {
    id: randomUUID(),
    from: input.from,
    to: input.to,
    message: input.message.trim(),
    createdAt: new Date().toISOString(),
  };

  getStore().messages.push(message);
  return message;
}

export function saveOfficePreference(key: string, preference: OfficePreference) {
  getStore().preferences[key] = preference;
  return preference;
}

export function getOfficePreference(key: string) {
  return getStore().preferences[key] ?? null;
}
