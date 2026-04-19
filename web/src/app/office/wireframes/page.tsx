import { PROTOTYPES } from "@/data/wireframes";
import { Panel, PanelHeader } from "@/components/Panel";
import { CyberText } from "@/components/CyberText";

export const metadata = { title: "Monitor Wall — Wireframes" };

export default function WireframesPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.3em] text-cyan">monitor_wall_01</div>
        <CyberText as="h1" className="text-3xl md:text-4xl">WIREFRAMES</CyberText>
        <p className="max-w-3xl text-sm leading-relaxed text-dust">
          Every prior prototype, indexed. Each lives in its own GitHub repo. Phase B task: import
          each as a branch in Dev Lab so we can cherry-pick cleanly and diff versions side-by-side.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {PROTOTYPES.map((p) => {
          const tone =
            p.status === "active"
              ? "acid"
              : p.status === "reference"
                ? "violet"
                : "cyan";
          return (
            <Panel key={p.slug} tone={tone}>
              <PanelHeader
                eyebrow={p.version}
                title={p.title}
                right={
                  <span className="text-[10px] uppercase tracking-[0.25em] text-dust">
                    {p.status}
                  </span>
                }
              />
              <p className="text-[13px] leading-relaxed text-chrome/90">{p.summary}</p>

              <div className="mt-3">
                <div className="text-[10px] uppercase tracking-[0.25em] text-cyan/80">
                  learnings
                </div>
                <ul className="mt-1 space-y-1 text-[12px] text-dust">
                  {p.learnings.map((l) => (
                    <li key={l}>
                      <span className="text-cyan">»</span> {l}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-1 text-[12px]">
                <div>
                  <span className="text-dust">repo:</span>{" "}
                  <a href={p.repo} target="_blank" rel="noreferrer" className="text-cyan">
                    {p.repo.replace("https://github.com/", "")}
                  </a>
                </div>
                <div>
                  <span className="text-dust">import branch:</span>{" "}
                  <code className="text-acid">{p.importBranch}</code>
                </div>
                {p.preview && (
                  <div>
                    <span className="text-dust">preview:</span>{" "}
                    <a href={p.preview} target="_blank" rel="noreferrer" className="text-cyan">
                      open
                    </a>
                  </div>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel>
        <PanelHeader eyebrow="how-to" title="Import a prior prototype as a branch" />
        <pre className="overflow-x-auto rounded-sm border border-cyan/10 bg-ink p-3 text-[12px] leading-relaxed text-chrome/90">{`# inside Dev Lab repo root
git remote add v5 https://github.com/GHX5T-SOL/CyberTrader-Age-of-Pantheon-v5.git
git fetch v5
git checkout -b reference/v5 v5/main
git push -u origin reference/v5

# now you can:
#   - diff against main:     git diff main..reference/v5
#   - cherry-pick a commit:  git cherry-pick <sha>
#   - open a PR from ref →   https://github.com/GHX5T-SOL/Dev-lab-of-CyberTrader-Age-of-Pantheon-/compare/main...reference/v5`}</pre>
      </Panel>

      <Panel tone="violet">
        <PanelHeader eyebrow="phase B upgrade" title="Interactive mobile emulator embed" />
        <p className="text-[13px] leading-relaxed text-dust">
          Plan: each prototype that has a live web preview gets an <code className="text-cyan">iframe</code>{" "}
          mounted inside a styled phone-bezel frame. For builds without a live web preview, we embed
          a Snack (Expo Snack) link that spins up the prototype on-demand. Onlook is{" "}
          <span className="text-heat">not viable</span> — it can&apos;t edit Expo/RN, and it&apos;s not embeddable.
        </p>
      </Panel>
    </div>
  );
}
