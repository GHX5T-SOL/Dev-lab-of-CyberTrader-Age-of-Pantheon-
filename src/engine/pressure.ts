import type {
  HeatPressureConsequence,
  HeatPressureStage,
  HeatPressureState,
  MicroReward,
  TradeStreak,
} from "@/engine/types";

const PRESSURE_DELAYS: Record<HeatPressureStage, number> = {
  0: 0,
  1: 120_000,
  2: 90_000,
  3: 60_000,
  4: 40_000,
};

export function getHeatPressureStage(heat: number): HeatPressureStage {
  if (heat >= 70) {
    return 4;
  }
  if (heat >= 50) {
    return 3;
  }
  if (heat >= 30) {
    return 2;
  }
  if (heat >= 20) {
    return 1;
  }
  return 0;
}

export function createInitialHeatPressure(nowMs: number, heat: number): HeatPressureState {
  const stage = getHeatPressureStage(heat);
  return {
    stage,
    status: statusForStage(stage),
    scanLockAt: stage === 0 ? null : nowMs + PRESSURE_DELAYS[stage],
    lastConsequenceAt: null,
    lastMessage: stage === 0 ? null : messageForStage(stage),
  };
}

export function advanceHeatPressure(input: {
  pressure: HeatPressureState;
  nowMs: number;
  heat: number;
}): {
  pressure: HeatPressureState;
  consequence: HeatPressureConsequence | null;
} {
  const stage = getHeatPressureStage(input.heat);

  if (stage === 0) {
    return {
      pressure: {
        stage: 0,
        status: "CLEAR",
        scanLockAt: null,
        lastConsequenceAt: input.pressure.lastConsequenceAt,
        lastMessage: null,
      },
      consequence: null,
    };
  }

  const stageChanged = stage !== input.pressure.stage;
  const scanLockAt = stageChanged || !input.pressure.scanLockAt
    ? input.nowMs + PRESSURE_DELAYS[stage]
    : input.pressure.scanLockAt;

  if (scanLockAt > input.nowMs) {
    return {
      pressure: {
        ...input.pressure,
        stage,
        status: statusForStage(stage),
        scanLockAt,
        lastMessage: messageForStage(stage),
      },
      consequence: null,
    };
  }

  const consequence = consequenceForStage(stage, input.nowMs);
  return {
    pressure: {
      stage,
      status: statusForStage(stage),
      scanLockAt: input.nowMs + PRESSURE_DELAYS[stage],
      lastConsequenceAt: input.nowMs,
      lastMessage: consequence.message,
    },
    consequence,
  };
}

export function getNextStreakTarget(count: number): {
  target: number;
  tradesNeeded: number;
  bonusPercent: number;
  title: string;
} {
  const targets = [
    { target: 2, bonusPercent: 3, title: "+3% XP" },
    { target: 3, bonusPercent: 5, title: "+5% XP" },
    { target: 5, bonusPercent: 8, title: "+8% XP" },
    { target: 7, bonusPercent: 12, title: "+12% XP" },
    { target: 10, bonusPercent: 15, title: "+15% XP" },
    { target: 15, bonusPercent: 20, title: "+20% XP" },
  ];
  const next = targets.find((item) => count < item.target) ?? targets[targets.length - 1]!;
  return {
    ...next,
    tradesNeeded: Math.max(0, next.target - count),
  };
}

export function isStreakNearWin(streak: TradeStreak): boolean {
  return streak.count > 0 && getNextStreakTarget(streak.count).tradesNeeded <= 2;
}

export function getStreakTimeRemaining(streak: TradeStreak, nowMs: number): number | null {
  return streak.expiresAt ? Math.max(0, streak.expiresAt - nowMs) : null;
}

export function getStreakRiskHeatBonus(streak: TradeStreak): number {
  if (streak.count >= 10) {
    return 4;
  }
  if (streak.count >= 7) {
    return 3;
  }
  if (streak.count >= 5) {
    return 2;
  }
  if (streak.count >= 2) {
    return 1;
  }
  return 0;
}

export function makeMicroReward(input: {
  label: string;
  value: string;
  tone: MicroReward["tone"];
  nowMs: number;
}): MicroReward {
  return {
    id: `reward_${input.nowMs}_${input.tone}_${input.label.replace(/[^a-z0-9]/gi, "_")}`,
    label: input.label,
    value: input.value,
    tone: input.tone,
    createdAt: input.nowMs,
  };
}

function statusForStage(stage: HeatPressureStage): HeatPressureState["status"] {
  if (stage >= 4) {
    return "SCAN_LOCK";
  }
  if (stage === 3) {
    return "TRACKING";
  }
  if (stage >= 1) {
    return "WARNING";
  }
  return "CLEAR";
}

function messageForStage(stage: HeatPressureStage): string {
  if (stage >= 4) {
    return "eAgent scan lock forming. Ignore it and Heat spikes again.";
  }
  if (stage === 3) {
    return "Scanner tracking active. Heat intervention is imminent.";
  }
  if (stage === 2) {
    return "Random inspection window opened. Reduce Heat before scan lock.";
  }
  return "Gentle scanner ping. Heat pressure check queued.";
}

function consequenceForStage(stage: HeatPressureStage, nowMs: number): HeatPressureConsequence {
  if (stage >= 4) {
    return {
      id: `heat_spike_${nowMs}`,
      stage,
      heatDelta: 3,
      message: "SCAN LOCK: unresolved pressure spiked Heat.",
      tone: "danger",
      lockTrading: false,
      lockDurationMs: 0,
    };
  }

  if (stage === 3) {
    return {
      id: `heat_intervention_${nowMs}`,
      stage,
      heatDelta: 6,
      message: "eAgent intervention: routed trades are now hotter.",
      tone: "danger",
      lockTrading: false,
      lockDurationMs: 0,
    };
  }

  if (stage === 2) {
    return {
      id: `heat_inspection_${nowMs}`,
      stage,
      heatDelta: 3,
      message: "Random inspection: scanner residue increased Heat.",
      tone: "warning",
      lockTrading: false,
      lockDurationMs: 0,
    };
  }

  return {
    id: `heat_gentle_${nowMs}`,
    stage,
    heatDelta: 1,
    message: "Scanner ping: Heat ticked upward while unmanaged.",
    tone: "warning",
    lockTrading: false,
    lockDurationMs: 0,
  };
}
