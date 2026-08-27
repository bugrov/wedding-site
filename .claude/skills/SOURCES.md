# Skill sources

Installed 2026-08-27, per project plan (`zazzy-stargazing-sundae.md`). Not installed: `fsd-skill` (decision: too heavyweight for this project's structure — see plan for rationale). Custom `/feature-review` skill is authored in-repo, not sourced externally.

| Skill | Source | License |
|---|---|---|
| `code-review-expert` | https://github.com/sanyuan0704/sanyuan-skills/tree/main/skills/code-review-expert | MIT |
| `frontend-design` | https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design | Official Anthropic plugin |
| `ui-ux-pro-max` | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT |
| `nextjs`, `tanstack-query`, `tanstack-table`, `react-hook-form-zod`, `rest-api-design`, `api-security-hardening`, `api-error-handling`, `api-authentication`, `csrf-protection`, `xss-prevention`, `security-headers-configuration`, `defense-in-depth-validation`, `seo-optimizer`, `technical-specification` | https://github.com/secondsky/claude-skills (see MARKETPLACE.md) | MIT |

**Usage caveats agreed in the plan**:
- `frontend-design` and `ui-ux-pro-max`: use only for animation/interaction/accessibility patterns and layout mechanics — do NOT let them propose colors/fonts that override the 5 fixed template directions and their tokens already defined in the plan.
