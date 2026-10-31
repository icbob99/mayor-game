---
name: md-refresh
description: Use in Mayor Game after every three user messages to check whether docs/agent-notes.md needs updating, or when explicitly asked to refresh project context. Also use after context recovery when the last check or message count is unknown.
---

# MD refresh — Mayor Game

Keep `docs/agent-notes.md` accurate enough to resume work without the full conversation. This is an agent workflow instruction, not a harness hook or background scheduler.

## When to check

- Count user-authored messages in this conversation, including short approvals and questions. Do not count assistant messages, tools, subagents, or quoted old messages.
- After the third user message since the last check, perform the check before the final reply, using results of the work just completed. Reset the count to zero after checking, even when no edit is needed.
- Keep the count and the last checked user message in working context and any handoff summary. Do not create a counter file or edit the journal just to advance a counter.
- If context recovery loses the count or checkpoint, check now and restart at zero. An explicit refresh also resets the count. Existing requirements to record completed work still apply before three messages have elapsed.

## What to reconcile

Read the current-state section and the sections affected by recent messages. Compare them with the user's actual decisions and available evidence: inspected code, test results, Git status/history and known deployment state. Use read-only checks where evidence is missing; do not rerun the application or query production just to refresh notes.

When facts changed, update the existing statements and reconcile every current reference to that fact: current state, D/P requirements, tracker, verification rows and next steps. Replace obsolete claims; retain useful history only when clearly marked as historical. In particular, distinguish:

- approved design, implemented behavior, automated checks and the user's manual acceptance;
- local edits, committed changes, pushed changes and deployment;
- an approval for a completed action and authorization for a future action;
- verified facts and unresolved questions.

Example: after P4 is implemented, tested and pushed, remove current claims that P4 is unstarted, cloud saving is absent, or its commit is still awaiting approval. Preserve the fact that manual acceptance and production deployment may still be pending.

If nothing relevant changed, leave the file untouched. A conceptual conversation about agents does not need to become project history. Do not append another summary where an existing entry can be corrected.

## Scope and completion

The user authorized routine maintenance of this agent journal. Keep README and the user roadmap outside this workflow. Keep this cadence project-local; existing global documentation and Git rules still apply. This skill grants no code changes, deployments, commits, amendments or pushes. A refresh after a completed commit may leave an uncommitted documentation change; never amend or create another commit automatically.

Read the resulting diff, check related statuses for contradictions, and run `git diff --check` after edits. Report material corrections briefly; do not add user-facing noise for a no-change check. Do not claim that the skill technically guarantees a harness trigger or prevents all context loss.
