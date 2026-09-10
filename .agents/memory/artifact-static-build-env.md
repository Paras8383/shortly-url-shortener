---
name: Static build environment
description: Production build configuration for static Vite artifacts.
---

Static artifact builds run before the development workflow environment is injected, so Vite configuration must provide build-safe defaults for PORT and BASE_PATH. Runtime workflows can still override those values.

**Why:** Shortly's local workflow supplied both variables, but publishing failed before compilation because the build command did not have the development-only PORT value.

**How to apply:** Use defaults such as PORT 5173 and BASE_PATH "/" in Vite config, while preserving environment overrides for dev and preview servers.