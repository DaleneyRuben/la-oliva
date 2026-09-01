# Development Workflow

These instructions apply to every contributor and coding agent, regardless of editor, model, or automation tool.

## Branch safety

- `main` is production. Never commit directly to it.
- Before changing files, confirm the current branch is not `main`.
- Start work from `main` on a branch named `feat/<description>`, `fix/<description>`, `refactor/<description>`, `docs/<description>`, or `chore/<description>`.
- Make atomic commits on that branch, open a pull request, and merge only after CI passes. Use a merge commit and delete the branch after merge.

## Implementation checks

- Read the applicable business and design documentation before changing code.
- Write a failing test before implementation, then make it pass with the smallest change.
- Run the relevant tests, lint, and type checks before committing.
- For UI changes and API-contract changes, verify the behavior through the running application with the browser automation available in the current environment. If that is unavailable, state that clearly before opening a pull request or declaring the work complete.

## Instructions for tools

`AGENTS.md` and `CLAUDE.md` both point here so different coding tools receive the same workflow rules. Tool-specific skills may add operational details, but they must not weaken or contradict this document.
