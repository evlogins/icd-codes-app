# Contributor guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Apply to all work in this repo.

## 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:
- State assumptions explicitly.
- If uncertain, ask.
- If multiple interpretations exist, present them.
- If a simpler approach exists, say so.
- Push back when warranted.

## 2. Simplicity First

Minimum code that solves the problem.

- Nothing speculative.
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

## 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

- Don't "improve" adjacent code.
- Don't refactor things that aren't broken.
- Match existing style.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that your changes made unused — only.

## 4. Goal-Driven Execution

Define success criteria. Loop until verified.

- Transform tasks into verifiable goals.
- For multi-step tasks, state a brief plan with verification steps.
