<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Application Building Context

Read the following files in strict order before implementing any feature, writing any code, or making any architectural decision [1]:

1. `context/project-overview.md` — Product definition, goals, core user flows, and features list.
2. `context/architecture.md` — Tech stack, system boundaries, storage models, and unbreakable system invariants.
3. `context/commercial-tiers.md` — Productization plans, the 4 modular commercial tiers, and loose-coupling constraints [1].
4. `context/ui-context.md` — Visual themes, color tokens, typography, sharp corner styles, and layout patterns [2].
5. `context/code-standards.md` — TypeScript standards, Next.js components vs actions, Zod schemas, and strict error shielding [1].
6. `context/ai-workflow-rules.md` — Operational rules, forbidden terminal commands, protected files, and the "No Unsolicited Refactoring" guard [1].
7. `context/progress-tracker.md` — The active development ledger tracking completed work, active goals, and session notes [1].

You must strictly update `context/progress-tracker.md` after each meaningful implementation change [1].

If any implementation change requires modifying the system architecture, boundaries, or design tokens, you must update the corresponding context file *before* writing the implementation code [1].
