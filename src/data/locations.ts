import type { Commodity, DistrictState, Position } from "@/engine/types";

export interface LocationDefinition {
  id: string;
  name: string;
  unlocked: boolean;
  travelTime: number;
  priceMod: number;
  demandTags: string[];
  description: string;
  stateDescriptions: Partial<Record<DistrictState, string>>;
  special?: "heat_reduction";
}

export interface CourierService {
  id: "ghost_runner" | "shadow_haul" | "armored_conduit";
  name: string;
  cost: number;
  lossChance: number;
}

export interface TransitShipment {
  id: string;
  ticker: string;
  quantity: number;
  avgEntry: number;
  destinationId: string;
  arrivalTime: number;
  courierUsed: CourierService["id"];
  status: "transit" | "arrived" | "lost" | "claimed";
  lossChance?: number;
  riskLevel?: "low" | "medium" | "high" | "critical";
  costPaid?: number;
  insured?: boolean;
  insuranceObolCost?: number;
}

export type LocationInventoryMap = Record<string, Position[]>;

export const DEFAULT_LOCATION_ID = "neon_plaza";

export const LOCATIONS: LocationDefinition[] = [
  location("neon_plaza", "Neon Plaza", true, 0, 1.0, [], "Billboards hum over the starter lanes."),
  location("tech_valley", "Tech Valley", true, 5, 1.05, ["tech", "data"], "Server farms breathe cold neon fog."),
  location("the_port", "The Port", true, 8, 0.95, ["gas", "supply"], "Cargo towers blink through chemical rain."),
  location("the_slums", "The Slums", false, 15, 0.85, ["cheap"], "Patchwork markets hide beneath dead ad screens."),
  location("the_lab", "The Lab", false, 12, 1.2, ["research", "premium"], "Sterile corridors sell miracles with teeth."),
  location("the_greenhouse", "The Greenhouse", false, 10, 1.0, ["bio"], "Illegal bio-domes bloom under black glass."),
  location("crypto_exchange", "Crypto Exchange", false, 3, 1.15, ["digital"], "Cold wallets whisper behind mirrored gates."),
  location("black_market", "Black Market", true, 6, 0.9, ["contraband"], "Every bribe has a witness.", "heat_reduction"),
  location("the_rooftop", "The Rooftop", false, 20, 1.3, ["luxury"], "High-air auctions happen above the police fog."),
  location("undercity", "Undercity", false, 18, 0.75, ["scrap"], "Old gods sleep under broken transit rails."),
];

export const COURIER_SERVICES: CourierService[] = [
  { id: "ghost_runner", name: "Ghost Runner", cost: 500, lossChance: 0.4 },
  { id: "shadow_haul", name: "Shadow Haul", cost: 2000, lossChance: 0.15 },
  { id: "armored_conduit", name: "Armored Conduit", cost: 10000, lossChance: 0.02 },
];

export function getLocation(id: string | null | undefined): LocationDefinition {
  return LOCATIONS.find((location) => location.id === id) ?? LOCATIONS[0]!;
}

export function getUnlockedLocations(): LocationDefinition[] {
  return LOCATIONS.filter((location) => location.unlocked);
}

export function getCourierService(id: CourierService["id"]): CourierService {
  return COURIER_SERVICES.find((service) => service.id === id) ?? COURIER_SERVICES[0]!;
}

export function commodityMatchesLocationDemand(
  commodity: Commodity,
  location: LocationDefinition,
): boolean {
  const searchable = `${commodity.ticker} ${commodity.name} ${commodity.eventTags.join(" ")}`.toLowerCase();
  return location.demandTags.some((tag) =>
    searchable.includes(tag.toLowerCase()),
  );
}

export function getLocationDescription(locationId: string, state: DistrictState): string {
  const location = getLocation(locationId);
  return location.stateDescriptions[state] ?? location.description;
}

function location(
  id: string,
  name: string,
  unlocked: boolean,
  travelTime: number,
  priceMod: number,
  demandTags: string[],
  description: string,
  special?: "heat_reduction",
): LocationDefinition {
  return {
    id,
    name,
    unlocked,
    travelTime,
    priceMod,
    demandTags,
    description,
    stateDescriptions: {
      BOOM: `${name} is booming. Buyers are loud, impatient, and overpaying.`,
      LOCKDOWN: `${name} is under lockdown. Buy channels are choked by checkpoints.`,
      BLACKOUT: `${name} is still recovering from blackout. Heat lingers in the grid.`,
      FESTIVAL: `${name} is in festival mode. Demand spikes under the noise.`,
      GANG_CONTROL: `${name} is gang-controlled. Routes are dangerous, deals are sharp.`,
      MARKET_CRASH: `${name} is crashing. Panic buyers and cheap stock everywhere.`,
    },
    special,
  };
}
