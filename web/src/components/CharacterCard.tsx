import type { TeamMember } from "@/data/team";
import clsx from "clsx";

/**
 * Placeholder character card. Phase B replaces the initials block with a
 * SpriteCook-generated portrait at member.avatar.
 */
export function CharacterCard({ member }: { member: TeamMember }) {
  const initials = member.name.slice(0, 2).toUpperCase();
  return (
    <div
      className={clsx(
        "panel flex flex-col gap-3 rounded-sm p-5",
        member.kind === "founder" && "panel-acid",
        member.kind === "openclaw" && "panel-violet"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border text-lg tracking-[0.2em]"
          style={{
            borderColor: `${member.accent}55`,
            background: `linear-gradient(135deg, ${member.accent}22 0%, #0a0d12 100%)`,
            color: member.accent,
          }}
          aria-label={`${member.name} avatar placeholder`}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h3 className="text-base uppercase tracking-[0.2em] text-chrome">
              {member.name}
            </h3>
            <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
              {member.codename}
            </span>
          </div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-dust">
            {member.role} · {member.pronouns}
          </div>
          <div className="mt-2 text-[11px] italic text-dust/80">
            <span className="text-cyan/80">{">"}</span> {member.statusLine}
          </div>
        </div>
      </div>

      <div className="border-t border-cyan/10 pt-3 text-[12px] leading-relaxed text-dust">
        {member.persona}
      </div>

      <div className="text-[12px] leading-relaxed text-chrome/90">
        {member.description}
      </div>

      <div className="flex flex-wrap gap-2">
        {member.skills.map((s) => (
          <span
            key={s}
            className="rounded-sm border border-cyan/20 bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-chrome/80"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
        activates: {member.activatesWhen}
      </div>

      {member.agentFilePath && (
        <div className="text-[10px] text-dust">
          <span className="text-dust/60">spec:</span>{" "}
          <code className="text-cyan/80">{member.agentFilePath}</code>
        </div>
      )}
      <div className="grid gap-1 border-t border-cyan/10 pt-2 text-[10px] text-dust">
        {member.node && (
          <div>
            <span className="text-dust/60">node:</span>{" "}
            <code className="text-acid/90">{member.node}</code>
          </div>
        )}
        <div>
          <span className="text-dust/60">glb:</span>{" "}
          <code className="text-cyan/80">{member.glbModelPath}</code>
        </div>
      </div>
    </div>
  );
}
