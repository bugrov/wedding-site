---
name: feature-review
description: Run after finishing a major feature or page in this project (a template, an admin page, the RSVP flow, etc.) — before committing. Runs code review, static checks, and visual/responsive QA in the browser at desktop/tablet/mobile breakpoints, then reports findings for the user to approve before work continues.
---

# Feature Review

This project (wedding site builder) is built in stages: one feature-sized unit of work at a time, reviewed, then confirmed by the user before moving on (see the project plan and memory — this is an explicit, non-negotiable workflow rule, not a suggestion). This skill is the review gate for each stage.

**After running this skill, stop.** Present the findings and screenshots, then end the turn — do not proceed to the next feature or create a git commit until the user has looked it over and explicitly approved it or told you what to fix. This overrides any general instinct to keep going.

## Steps

### 1. Code review
Invoke `/code-review` against the current uncommitted diff for this feature. Carry its findings into the final report — correctness bugs, security issues, and reuse/simplification opportunities.

### 2. Static checks
Run, in the project root:
- `npm run lint` (ESLint)
- `npx prettier --check .` (or the project's configured format-check script)
- `npx tsc --noEmit` (typecheck)

Fix anything trivial yourself (formatting, obvious type errors) before moving to visual QA — don't burn browser-testing time on code that doesn't even typecheck.

### 3. Start the dev server
Check whether `next dev` (or `docker compose up`) is already running for this project; if not, start it in the background before the browser steps.

### 4. Visual QA in the browser (claude-in-chrome)
Load the browser tools if not already loaded (see the claude-in-chrome skill/tool-search guidance). For the page(s)/feature just built:

- Resize/screenshot at three breakpoints: **desktop (~1440px)**, **tablet (~768px)**, **mobile (~375px)**.
- At each breakpoint check for: layout overflow or broken wrapping, text that's clipped or illegible, images loading with correct aspect ratio (no layout jump), interactive elements (buttons, checkboxes, links) actually reachable/clickable and not overlapping.
- **Cyrillic check**: this project requires every font to render Cyrillic correctly (see plan) — specifically verify Russian text is rendering in the intended font, not silently falling back to a generic system font (a common failure mode when a chosen Google Font lacks a Cyrillic subset).
- For interactive features (a form, the block checkboxes in the configurator, the RSVP flow, etc.): actually click/type through the primary user flow once per breakpoint that matters (at minimum desktop + mobile) — a screenshot alone doesn't prove the feature works.

### 5. Image performance check (only if this feature touches photos/visual assets)
Confirm images go through `next/image` correctly: responsive `sizes`, modern format (WebP/AVIF) served, explicit width/height (no layout shift), lazy loading for below-the-fold images, priority loading only for the actual hero/LCP image. Watch the network panel or page load on a throttled/mobile viewport for anything that visibly hangs or loads with visible jank.

### 6. Report
Summarize, in one message:
- Code review findings (from step 1), most severe first
- Any static-check issues left unresolved and why
- Visual/responsive issues found per breakpoint, with screenshots
- Whether image performance looks acceptable (if applicable)

Then **stop** and wait for the user's response before doing anything else with this feature.
