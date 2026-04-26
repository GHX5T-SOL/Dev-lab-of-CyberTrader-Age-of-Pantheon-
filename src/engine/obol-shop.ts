import { getShopItem } from "@/data/shop-items";
import type { ShopItem } from "@/engine/types";

export const ENABLE_OBOL_TOKEN =
  typeof process !== "undefined" && process.env.EXPO_PUBLIC_ENABLE_OBOL_TOKEN === "true";

export const MOCK_STARTING_OBOL_BALANCE = 100;

export interface PurchaseResult {
  ok: true;
  item: ShopItem;
  nextBalance: number;
  purchaseId: string;
} 

export type PurchaseError =
  | "feature_disabled"
  | "item_missing"
  | "item_unavailable"
  | "insufficient_obol"
  | "weekly_limit";

export function purchaseShopItem(input: {
  itemId: string;
  obolBalance: number;
  purchasedAt: number;
  purchaseHistory: Record<string, number[]>;
  featureEnabled?: boolean;
}): PurchaseResult | { ok: false; reason: PurchaseError } {
  const enabled = input.featureEnabled ?? ENABLE_OBOL_TOKEN;
  if (!enabled) {
    return { ok: false, reason: "feature_disabled" };
  }

  const item = getShopItem(input.itemId);
  if (!item) {
    return { ok: false, reason: "item_missing" };
  }

  if (!item.available) {
    return { ok: false, reason: "item_unavailable" };
  }

  if (item.purchaseLimit === "1 per calendar week" && wasPurchasedThisUtcWeek(input.purchaseHistory[item.id] ?? [], input.purchasedAt)) {
    return { ok: false, reason: "weekly_limit" };
  }

  if (input.obolBalance < item.obolPrice) {
    return { ok: false, reason: "insufficient_obol" };
  }

  return {
    ok: true,
    item,
    nextBalance: input.obolBalance - item.obolPrice,
    purchaseId: `shop_${item.id}_${input.purchasedAt}`,
  };
}

export function wasPurchasedThisUtcWeek(purchases: number[], nowMs: number): boolean {
  const week = getUtcWeekKey(nowMs);
  return purchases.some((timestamp) => getUtcWeekKey(timestamp) === week);
}

export function getUtcWeekKey(nowMs: number): string {
  const date = new Date(nowMs);
  const day = date.getUTCDay();
  const diffToMonday = (day + 6) % 7;
  const monday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  monday.setUTCDate(monday.getUTCDate() - diffToMonday);
  return monday.toISOString().slice(0, 10);
}
