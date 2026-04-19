import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "cyan" | "heat" | "acid" | "violet";

export function Panel({
  tone = "cyan",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  const toneClass =
    tone === "heat"
      ? "panel-heat"
      : tone === "acid"
        ? "panel-acid"
        : tone === "violet"
          ? "panel-violet"
          : "";
  return (
    <div className={clsx("panel rounded-sm p-5", toneClass, className)}>
      {children}
    </div>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4 border-b border-cyan/10 pb-3">
      <div>
        {eyebrow && (
          <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/70">
            {eyebrow}
          </div>
        )}
        <h2 className="mt-1 text-lg tracking-wide text-chrome">{title}</h2>
      </div>
      {right}
    </div>
  );
}
