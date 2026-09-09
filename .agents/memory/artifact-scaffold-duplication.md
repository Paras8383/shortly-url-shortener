---
name: Scaffold duplication failures
description: A workspace-specific diagnostic clue for concatenated scaffold files that break pnpm or TypeScript.
---

When a freshly scaffolded artifact fails with an unexpected JSON parse or duplicate-identifier error, check whether a manifest or generated source file contains the same complete block repeated back-to-back. The first reported file is not always the only affected file.

**Why:** The workspace previously contained concatenated copies of package manifests and frontend scaffold files. Fixing only the first parse error exposed the next duplicated layer, while the actual UI itself was otherwise healthy.

**How to apply:** Validate every manifest with a JSON parser, search affected source files for repeated import/export boundaries, keep runtime-critical files clean, and restart the affected workflow after the cleanup.