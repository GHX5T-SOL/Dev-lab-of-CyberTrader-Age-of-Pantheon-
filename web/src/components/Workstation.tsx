"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

interface WorkstationProps {
  href: string;
  title: string;
  subtitle?: string;
  icon: string; // single glyph or tiny ascii
  tone?: "cyan" | "acid" | "heat" | "violet" | "amber";
  occupants?: string[]; // names of characters working at this station
  preview?: string;
  className?: string;
}

const toneMap: Record<NonNullable<WorkstationProps["tone"]>, string> = {
  cyan: "panel",
  acid: "panel panel-acid",
  heat: "panel panel-heat",
  violet: "panel panel-violet",
  amber: "panel",
};

export function Workstation({
  href,
  title,
  subtitle,
  icon,
  tone = "cyan",
  occupants = [],
  preview,
  className,
}: WorkstationProps) {
  return (
    <Link href={href} className="group block no-underline">
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className={clsx(
          toneMap[tone],
          "relative h-full rounded-sm p-5 transition-colors",
          "group-hover:border-cyan/60",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-cyan/30 bg-void/70 font-[var(--font-display)] text-base text-cyan">
            {icon}
          </div>
          <div className="text-[9px] uppercase tracking-[0.25em] text-dust">
            enter →
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-base uppercase tracking-[0.2em] text-chrome">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-dust">
              {subtitle}
            </p>
          )}
        </div>

        {preview && (
          <p className="mt-4 line-clamp-3 text-[12px] leading-relaxed text-dust">
            {preview}
          </p>
        )}

        {occupants.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {occupants.map((o) => (
              <span
                key={o}
                className="rounded-sm border border-cyan/15 bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-dust"
              >
                · {o}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
