type Volatility = "very_low" | "low" | "med" | "high" | "very_high";
type HeatRisk = "very_low" | "low" | "med" | "high" | "very_high";

interface Commodity {
  ticker: string;
  basePrice: number;
  volatility: Volatility;
  heatRisk: HeatRisk;
}

const commodities: Commodity[] = [
  { ticker: "FDST", basePrice: 138, volatility: "high", heatRisk: "high" },
  { ticker: "PGAS", basePrice: 91, volatility: "med", heatRisk: "med" },
  { ticker: "NGLS", basePrice: 73, volatility: "low", heatRisk: "low" },
  { ticker: "HXMD", basePrice: 66, volatility: "med", heatRisk: "high" },
  { ticker: "VBLM", basePrice: 24, volatility: "low", heatRisk: "very_low" },
  { ticker: "ORRS", basePrice: 112, volatility: "med", heatRisk: "med" },
  { ticker: "SNPS", basePrice: 84, volatility: "med", heatRisk: "med" },
  { ticker: "MTRX", basePrice: 58, volatility: "low", heatRisk: "low" },
  { ticker: "AETH", basePrice: 41, volatility: "high", heatRisk: "high" },
  { ticker: "BLCK", basePrice: 179, volatility: "very_high", heatRisk: "very_high" },
];

const volatilityFactor: Record<Volatility, number> = {
  very_low: 0.003,
  low: 0.005,
  med: 0.009,
  high: 0.014,
  very_high: 0.02,
};

const heatFactor: Record<HeatRisk, number> = {
  very_low: 1,
  low: 2,
  med: 4,
  high: 6,
  very_high: 8,
};

const driftBias: Record<string, number> = {
  VBLM: 0.0035,
  FDST: 0.0015,
  PGAS: 0.001,
  NGLS: 0.0005,
  HXMD: 0.0012,
  ORRS: 0.0018,
  SNPS: 0.0012,
  MTRX: 0.0008,
  AETH: 0.0016,
  BLCK: 0.0022,
};

type PriceMap = Record<string, number>;

function xfnv1a(value: string): number {
  let h = 2166136261 >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    h ^= value.charCodeAt(index);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededStream(key: string): () => number {
  return mulberry32(xfnv1a(key));
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

function initialPrices(): PriceMap {
  return Object.fromEntries(
    commodities.map((commodity) => [commodity.ticker, commodity.basePrice]),
  );
}

export function getServerPrice(ticker: string, tick: number): number | null {
  const targetTick = Math.max(0, Math.floor(tick));
  let prices = initialPrices();

  for (let cursor = 1; cursor <= targetTick; cursor += 1) {
    const nextPrices: PriceMap = {};

    for (const commodity of commodities) {
      const current = prices[commodity.ticker] ?? commodity.basePrice;
      const stream = seededStream(`${commodity.ticker}:${cursor}:market`);
      const noise = (stream() - 0.5) * 2;
      const drift = driftBias[commodity.ticker] ?? 0;
      const swing = noise * volatilityFactor[commodity.volatility];
      nextPrices[commodity.ticker] = roundCurrency(
        Math.max(1, current * (1 + drift + swing)),
      );
    }

    prices = nextPrices;
  }

  return prices[ticker] ?? null;
}

export function getServerHeatDelta(
  ticker: string,
  side: "BUY" | "SELL",
): number | null {
  const commodity = commodities.find((item) => item.ticker === ticker);
  if (!commodity) {
    return null;
  }

  const heat = heatFactor[commodity.heatRisk];
  return side === "BUY" ? heat : Math.max(1, heat - 3);
}
