# AI Workflow Rules

## Approach

- **Spec-Driven Agentic Development**: This project is built incrementally using a strict spec-driven workflow. The human developer acts as the Architect; the AI agent acts strictly as the implementation engine.
- **No Speculative Coding**: You must always implement code against the exact specifications defined in the active `context/specs/` markdown files. Do not infer, assume, or invent product behavior from scratch.
- **Prerequisite Context Reading**: You must read your system instructions at the start of every session, which directs you to load all context files to restore full system memory before writing any code.

## Scoping Rules

- **One Feature at a Time**: Work on exactly one feature unit or `.md` specification file at a time.
- **Small Verifiable Steps**: Prefer small, isolated, and easily testable increments over large, speculative changes.
- **Strict Boundary Isolation**: Do not combine unrelated system boundaries in a single implementation step (for example, do not write database schemas and frontend React transitions in the same step).
- **No Unsolicited Refactoring**: You are strictly forbidden from modifying, refactoring, or optimizing any files that are not directly listed in the active feature specification. Do not touch stable, working code under the guise of "cleaning" or "improving" it unless explicitly instructed.
- **No Incomplete / Placeholder Code**: You are strictly forbidden from writing placeholder comments, stub files, or incomplete functions. Every line of code must be fully written out. Never use comments like `// ... rest of the code` or `TODO` as a substitute for complete implementation.

## When to Split Work

You must split an implementation step into smaller specs if it combines:
- Database schema changes (Payload collections) and public frontend styling.
- Public client forms (the Contact page) and transactional CRM sync hooks.
- Any task that cannot be fully verified end-to-end within 5 minutes of execution.

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- **Do Not Guess**: Do not invent product behavior or database structures that are not explicitly defined in the context or spec files.
- **Clarification First**: If a requirement is ambiguous or missing, stop immediately and ask the user (the Architect) for clarification.
- **Log Open Questions**: Add the missing requirement as an "Open Question" in `context/progress-tracker.md` before continuing.
- **Document Before Coding**: Update the relevant context files (`architecture.md` or `project-overview.md`) *before* writing any code.

## Protected Files & Commands

You are strictly forbidden from modifying, deleting, or executing the following unless explicitly instructed in a specification:
- `eslint.config.mjs` and `tsconfig.json` — System linting and TypeScript compiler configurations.
- `package.json` and `package-lock.json` — Project dependency files.
- **Terminal Package Installation**: You are strictly forbidden from executing `npm install`, `npm update`, `yarn add`, or any other dependency-installation commands in the terminal without prior authorization.
- Any third-party library files or folder structures outside our system boundaries.

## Keeping Docs in Sync

- **Document Updates**: You must update the relevant context file immediately whenever an implementation changes folder structures, database schemas, coding standards, or feature scopes.
- **No Secret Exposure**: Never copy, paste, or write sensitive credentials (such as database connection strings, passwords, API keys, or JWTs) into `progress-tracker.md`, git commit messages, or any public-facing log. Always redact them as `[REDACTED]` if logging errors.

## Before Moving to the Next Unit

Before declaring a unit complete, you must verify the following:
1. The current unit works end-to-end within its specified boundaries.
2. No system invariant defined in `architecture.md` was violated.
3. Inputs are strictly validated with Zod, and database errors are shielded.
4. `context/progress-tracker.md` is updated, moving the active task to "Completed" and logging session decisions.
5. `npm run build` compiles with zero TypeScript or ESLint errors.
6. **No Rule-Silencing**: Do not use `// @ts-ignore`, `// @ts-nocheck`, or `eslint-disable-next-line` comments to bypass compiler or linter errors. You must resolve the underlying type or linting mismatch directly in the code.
