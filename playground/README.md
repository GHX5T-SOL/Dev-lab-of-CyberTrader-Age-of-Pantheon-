# /playground — Experimental scratch area

Contents of this folder are **gitignored** by default (except this README). Use it for:

- Ad-hoc prototypes
- Throwaway script experiments
- Notebook-style explorations
- One-off assets that may or may not graduate

Anything worth keeping **graduates** into the main tree (`src/`, `brand/`, `docs/`, etc.) via a council review.

## Branch convention

Code experiments live on `experiment/<slug>` branches and **never merge to main**. If an experiment proves out, re-implement it cleanly on a `feat/<scope>-<slug>` branch.

## Prevent drift

Monthly: the PM Agent opens an issue listing all files in `playground/` older than 30 days. Stale experiments get graduated or deleted.
