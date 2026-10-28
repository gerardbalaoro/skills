---
name: setup-gerards-node-tooling
description: Configure Gerard's Node project tooling for a new or existing project.
disable-model-invocation: true
---

# Setup Gerard's Node Tooling

Configure package management, typechecks, linting, and formatting for a new or existing JavaScript or TypeScript project.

## Inspect the Project

Read the project instructions, package manifests, lockfiles, workspace definitions, TypeScript configuration, scripts, CI, and hooks.
Identify the runtime, frameworks, UI libraries, and test tools from dependencies, configuration, and source files.
Keep the runtime choice separate from the package manager choice.

For existing projects, run the current checks before changes to identify existing errors.
Preserve workspace boundaries, framework checks, build behavior, and useful project-specific rules.
For new projects, add only the project structure required for the requested setup.

## Package Manager

Use the existing package manager from `packageManager`, the active lockfile, and CI commands.
If these sources conflict, resolve the conflict from project instructions or ask the user.
If no package manager exists, use PNPM for Node projects or Bun for Bun projects.
Use the selected manager for dependency changes, scripts, CI, and tool execution.
Maintain its lockfile and record the selected version in `packageManager`.

## Lint and Format

Install compatible versions of `oxlint`, `oxfmt`, and `ultracite` as development dependencies.
Read their installed exports and current documentation before configuration.
Use `oxlint.config.ts` and `oxfmt.config.ts` with each tool's `defineConfig` helper.

Use Ultracite only for imported presets. **Do not run the `ultracite` CLI.**
Run Oxc tools directly from package scripts, CI, and hooks.

Start the lint configuration with the core and anti-slop presets:

```ts
import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";

export default defineConfig({
  extends: [core, antiSlop],
  ignorePatterns: core.ignorePatterns,
});
```

Add framework and library presets only for tools that the project uses.
For example, use `ultracite/oxlint/react` for React.
For Tailwind projects, read [the Tailwind integration](references/tailwind.md) for canonical classes, autofixes, and editor/CLI alignment.
For Tailwind v4 design systems, prefer `@shadcn/lint` through `ultracite/oxlint/shadcn`.
Read [the shadcn integration](references/shadcn.md) for its dependencies, plugin registration, and component discovery.
Use `ultracite/oxlint/tanstack` only for the TanStack packages covered by that preset.
Apply the same rule to other framework and test presets.
Make sure that each selected preset exists in the installed version.
Install its required plugin dependencies and preserve its `jsPlugins` registrations.
In mixed workspaces, scope framework rules to the packages that use that framework.

Use the Ultracite formatter preset with prose wrapping:

```ts
import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  printWidth: 100,
  proseWrap: "always",
});
```

Make sure that existing Markdown and MDX overrides also use `proseWrap: "always"`.
Preserve relevant ignore patterns and formatter integrations for the project.

## Typechecks

For Bun projects, use the built-in `bun check` command.
Make sure that the installed Bun version supports this command.
`bun run check` runs a package script and does not select the built-in checker.

For Node projects, install `oxlint-tsgolint` as a development dependency.
Use both `--type-aware` and `--type-check` to report lint diagnostics and TypeScript errors.
Type-aware linting alone does not replace a typecheck.

Retain framework-specific typechecks that cover files or generated types outside the selected checker's coverage.
Preserve TypeScript project references, source coverage, and runtime-specific types.
For JavaScript projects, preserve existing `checkJs` coverage without forcing a TypeScript migration.

## Scripts and Integration

Preserve useful script names. For new scripts, use these commands:

| Script             | Command                              |
| ------------------ | ------------------------------------ |
| `format`           | `oxfmt --write .`                    |
| `format:check`     | `oxfmt --check .`                    |
| `lint`             | `oxlint .`                           |
| `lint:fix`         | `oxlint --fix .`                     |
| `typecheck` (Bun)  | `bun check`                          |
| `typecheck` (Node) | `oxlint --type-aware --type-check .` |

Use automatic configuration discovery to preserve nested package configurations.
The `--config` flag disables nested discovery in both tools.
Reserve that flag for projects that intentionally consolidate package behavior into one configuration.
Use the same discovery behavior in scripts, CI, and hooks.

Update existing CI to use these scripts or the same direct Oxc commands.
Remove replaced tooling and dependencies after the replacement covers their responsibilities.
Retain tools for checks that Oxc does not cover.
Keep unrelated source changes outside this setup.

## Git Hooks

Inspect hook-manager configuration, lifecycle scripts, `core.hooksPath`, and active Git hooks.
Ignore Git's unused sample hooks.
If hooks already exist, use their current manager or custom scripts.
Preserve their commands and add the Oxc checks through that setup.

### New Lefthook Setup

If no hooks exist, install `lefthook` as a development dependency with the selected package manager.
Create `lefthook.yml` with a `pre-commit` hook that formats staged files before linting staged source files.
Use sequential execution and file patterns for each tool's supported files.
Run the local `oxfmt` and `oxlint` binaries through the selected package manager.
Pass `{staged_files}` and `--no-error-on-unmatched-pattern` to both tools.
Use `stage_fixed: true` for formatting to preserve partial staging through Lefthook's protection.
Keep typechecks project-wide instead of passing staged paths to the typechecker.

Make sure that dependency installation activates them for other contributors.
Preserve existing lifecycle scripts and account for package-manager restrictions on dependency install scripts.
If Git is initialized, run the local `lefthook install` after configuration to activate the hooks.
If Git is not initialized, leave hook installation pending and report the required command.

## Offer Gerard's Skills

Offer these project-local skills from `gerardbalaoro/skills`:

- Base: `git-conventions` and `writing-documentation` (the repository name for the requested writing-docs skill).
- Optional: `writing-tests`, for projects with tests or a requested test setup.
- Optional: `typescript-standards`, for projects that use TypeScript.

Ask which applicable skills the user wants to install. Continue independent tooling work while the answer is pending.
Install only the selected skills after the user accepts the offer.
Use `skills add gerardbalaoro/skills --skill <name>` through the selected package manager's package runner.
For example, use `pnpm dlx skills add gerardbalaoro/skills --skill git-conventions` with PNPM.
Use `bun x`, `npx`, or the existing manager's equivalent for other projects.
Preserve installed skills and the project's agent targets.

## Completion

Run the configured lint, typecheck, and formatting checks through the selected package manager.
Run existing tests or builds that the tooling changes affect.
Make sure that imports, plugin registrations, and configuration files load without errors.
For active hooks, run the configured hook checks without creating a commit.
On existing projects, distinguish new setup errors from existing source errors.
Keep the selected presets enabled while reporting source errors outside the requested scope.

Report the package manager, selected presets, typecheck command, hook setup, skill installation status, and check results.

## Tool References

- [Oxlint type-aware linting and typechecks](https://oxc.rs/docs/guide/usage/linter/type-aware)
- [Oxlint nested configuration](https://oxc.rs/docs/guide/usage/linter/nested-config.html)
- [Oxfmt configuration](https://oxc.rs/docs/guide/usage/formatter/config.html)
- [Ultracite presets](<https://github.com/haydenbleasel/ultracite/blob/main/apps/docs/docs/(guides)/presets.mdx>)
- [Bun typechecks](https://bun.com/docs/runtime/check)
- [Lefthook installation](https://lefthook.dev/usage/commands/install.html)
