import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Zoro's Notes" };

/**
 * Phase A: placeholder tray. Phase B: Remotion-generated explainer videos land
 * here — each an MP4 under /public/videos/ with a poster frame.
 *
 * Planned first batch (Reel will cut these):
 *   1. "What is the Dev Lab?" (90 sec) — tour of the virtual office
 *   2. "How the 12-agent team works" (2 min) — org chart + Council charter
 *   3. "From idea to MVP" (2 min) — the Phase 0 → Phase 5 pipeline
 *   4. "How to pick up a task" (60 sec) — Whiteboard → branch → PR
 *   5. "Prototype archaeology" (90 sec) — importing v1-v5 as branches
 *   6. "Brand palette discipline" (60 sec) — what violet is for and why
 */

const PLANNED_NOTES = [
  {
    slot: "note_01",
    title: "What is the Dev Lab?",
    duration: "~90s",
    summary:
      "A tour of the virtual office. What each workstation is. Why we built it. How to spend a productive session here.",
  },
  {
    slot: "note_02",
    title: "How the 12-agent team works",
    duration: "~2m",
    summary:
      "Meet the agents. Read the org chart. Understand when each activates. See a live Council session format.",
  },
  {
    slot: "note_03",
    title: "From idea to MVP: the pipeline",
    duration: "~2m",
    summary:
      "Phase 0 → 1 → 2 → 3 → soft launch. Which agents own which phase. What 'done' looks like at each gate.",
  },
  {
    slot: "note_04",
    title: "How to pick up a task",
    duration: "~60s",
    summary:
      "Whiteboard → branch → PR → review → merge. Commit conventions. How Council review works.",
  },
  {
    slot: "note_05",
    title: "Prototype archaeology",
    duration: "~90s",
    summary:
      "Why we keep v1-v5 around, how to import each as a branch, how to diff and cherry-pick.",
  },
  {
    slot: "note_06",
    title: "Brand palette discipline",
    duration: "~60s",
    summary:
      "Why violet = lore only. When to use cyan vs. acid. Motion rules. What breaks the voice.",
  },
];

export default function NotesPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-acid">desk_tray_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">
          ZORO&apos;S NOTES
        </CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Tray on Zoro&apos;s desk. Each note is a short Remotion-generated explainer video.
          Cut by <span className="text-chrome">Reel</span>. Phase B goes live — Phase A shows the
          planned slate so you know what&apos;s coming.
        </p>
      </header>

      <Panel tone="acid">
        <PanelHeader eyebrow="status" title="Phase B (next session)" />
        <p className="text-[13px] leading-relaxed text-chrome/90">
          The Remotion pipeline is scaffolded in the parent repo under{" "}
          <code className="text-cyan">skills/</code> (via <code className="text-cyan">remotion-dev/skills</code>).
          To cut the first note, run: <code className="text-cyan">npm run generate:cinematic</code> in the
          parent repo and follow the prompt. Output MP4s land in{" "}
          <code className="text-cyan">web/public/videos/</code>.
        </p>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2">
        {PLANNED_NOTES.map((n) => (
          <Panel key={n.slot}>
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.25em] text-cyan">{n.slot}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-dust">
                {n.duration}
              </div>
            </div>
            <h3 className="mt-2 text-base uppercase tracking-[0.2em] text-chrome">{n.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-dust">{n.summary}</p>
            <div className="mt-3 flex h-32 items-center justify-center rounded-sm border border-cyan/10 bg-ink text-[11px] uppercase tracking-[0.25em] text-dust">
              ▶ video lands in phase b
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
