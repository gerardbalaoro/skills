# Tailwind Class Checks

Configure these checks only for projects that use Tailwind CSS.
Use `oxlint-tailwindcss` for canonical classes and related class diagnostics.
Keep `@shadcn/lint` for the separate design-system policies in [the shadcn integration](shadcn.md).
Shadcn already supplies some scale suggestions through `no-arbitrary-values`.
Use this integration for general canonical spellings, conflicts, and scale checks outside the shadcn policy's coverage.

## Oxlint Configuration

Install `oxlint-tailwindcss` as a development dependency through the selected package manager.
Make sure that the installed runtime, Oxlint, and Tailwind versions meet its current requirements.
The plugin requires Tailwind v4.1.15 or newer.
For older Tailwind versions, retain existing compatible checks and report the unsupported CLI coverage.
Preserve the project's Tailwind version unless the user requests an upgrade.

Merge these fields into `oxlint.config.ts`:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["oxlint-tailwindcss"],
  settings: {
    tailwindcss: {
      entryPoint: "src/styles.css",
      rootFontSize: 16,
    },
  },
  rules: {
    "tailwindcss/enforce-canonical": ["warn", { reportNonEquivalent: true }],
    "tailwindcss/no-unnecessary-arbitrary-value": "warn",
    "tailwindcss/prefer-scale-token": ["warn", { step: 0.25 }],
    "tailwindcss/consistent-variant-order": "warn",
    "tailwindcss/no-deprecated-classes": "warn",
    "tailwindcss/no-conflicting-classes": "warn",
    "tailwindcss/no-unknown-classes": "warn",
  },
});
```

Preserve the existing core, anti-slop, and framework presets.
Merge root `jsPlugins`, `settings`, rules, and overrides instead of replacing them.
With the shadcn preset, include both `...shadcn.jsPlugins` and `"oxlint-tailwindcss"` in the root plugin array.
Keep `tailwindcss/no-unknown-classes` until equivalent shadcn coverage is demonstrated.
Compare file coverage, class discovery, theme discovery, and exceptions before removing either rule.
For matching coverage, disable duplicate diagnostics only within the matching file groups.
Retain the Tailwind rule for class locations that shadcn does not inspect.
Preserve stricter existing rule severities.

## Editor and CLI Alignment

Inspect `.vscode/settings.json`, `.code-workspace` files, and source usage before changing class discovery.
Use the existing shared editor configuration.
If no shared editor configuration exists, add the required Tailwind settings to `.vscode/settings.json`.

### Class Helpers and Attributes

Identify the class helpers, tagged templates, and custom class attributes that the project uses.
Configure IntelliSense's `tailwindCSS.classFunctions` and `tailwindCSS.classAttributes` for those locations.
Account for existing `tailwindCSS.experimental.classRegex` patterns.
Add custom helpers and tags through `settings.tailwindcss.callees` and `settings.tailwindcss.tags`.
Use `calleeExtractors` for wrappers around structured helpers such as `cva` and `tv`.
Use `attributes`, `attributePatterns`, and `variablePatterns` for the project's other class locations.
These fields extend the plugin's defaults.
Configure matching custom helpers in `settings.shadcn.mergeFunctions` and `settings.shadcn.variantFunctions` for the shadcn rules.
Translate editor patterns into the supported extractor fields instead of copying regexes between unrelated APIs.
Report editor patterns that the CLI extractors cannot represent.
Configure the applicable helpers and attributes in Oxfmt's `sortTailwindcss.functions` and `sortTailwindcss.attributes`.
Use exact names for Oxfmt, which does not support regex patterns in those lists.

### Stylesheet Paths

Use the actual Tailwind v4 stylesheet for `settings.tailwindcss.entryPoint` and Oxfmt's `sortTailwindcss.stylesheet`.
Make sure that IntelliSense discovers the same stylesheet.
If automatic discovery selects the wrong stylesheet, configure `tailwindCSS.experimental.configFile` explicitly.
For Tailwind v3, retain compatible lint checks and use Oxfmt's `sortTailwindcss.config`.
Resolve each path against its tool's configuration directory or working directory.
In workspaces, map each editor file glob to the matching package's stylesheet.
Scope CLI rules and formatting overrides to those same packages.

### Monorepo Settings

For multiple Tailwind stylesheets, use a root `settings.tailwindcss.entryPoint` mapping:

```ts
import { defineConfig } from "oxlint";

export default defineConfig({
  settings: {
    tailwindcss: {
      entryPoint: [
        { files: "apps/admin/**", use: "apps/admin/src/styles.css" },
        { files: "apps/storefront/**", use: "apps/storefront/src/styles.css" },
      ],
    },
  },
});
```

Merge these settings into the existing configuration.
Replace the paths with the project's actual packages and stylesheets.
The first matching mapping supplies the stylesheet.
Scope the selected Tailwind rules to the mapped file groups.
Resolve mapping file globs relative to Oxlint's working directory.

Oxlint rejects `settings` inside `overrides`.
Use file overrides for supported fields such as `rules`.
For different package settings beyond stylesheets, use package-level `oxlint.config.ts` files with their settings at the root.
This includes different root font sizes, class extractors, or shadcn discovery settings.
Preserve automatic nested discovery so repository-wide commands read those package configurations.

### Root Font Size

Read the project's root font size from its styles and shared editor configuration.
Use the same value for `tailwindCSS.rootFontSize` and `settings.tailwindcss.rootFontSize`.
Use `16` only for projects without a different root font size.
This value controls spacing conversions such as `mt-[16px]` to `mt-4`.

### Discovery Checks

Run Oxlint against representative class attributes and custom helper calls from the project.
Before removing an unknown-class rule, probe every registered class location with an invalid utility.
Make sure that the remaining rule reports each invalid utility in the intended files.
Make sure that the editor recognizes those same locations and uses the same theme.
Run Oxfmt against a representative helper call to make sure that class sorting applies.
Use temporary probes to inspect warnings and fixes without adding permanent source changes.

## Autofixes and Formatting

Use `lint:fix` to run `oxlint --fix` through the selected package manager.
Canonical forms with equivalent CSS support autofixes.
The related modernization rules also cover unnecessary arbitrary values, variant order, and deprecated classes.
Keep scale-token conversions such as `mt-[16px]` to `mt-4` as warnings and editor suggestions.
These conversions depend on theme variables and the root font size.
Keep `--fix-suggestions` outside automatic commit hooks.
Class conflicts need a warning because the linter cannot choose the intended style.
For example, `flex grid` needs a human decision about the intended layout.

Keep class sorting and line wrapping in Oxfmt.
Avoid duplicate class-order and line-wrapping rules from the lint plugin.
After lint fixes, run Oxfmt to restore the project's formatting.

## Performance

This plugin runs JavaScript and Tailwind initialization. It is not a Rust implementation.
Its content-hash disk cache reduces repeated design-system setup.
The first uncached run and changes that invalidate the cache can still add substantial startup time.

Measure uncached, cached, and staged-file runs against the project's current lint command.
Report those timings with the setup results.
Keep hook checks scoped to staged files.
For slow hook runs, separate Tailwind checks into a `lint:tailwind` script and CI.
Use `OXLINT_TAILWINDCSS_CACHE_DIR` to persist the cache across CI runs.
Keep a project-local cache directory outside version control.

## IntelliSense Coverage

The canonical-class rule uses Tailwind's canonicalization with an additional CSS-equivalence check.
The scale-token rule supplies the spacing suggestions that the conservative autofixer leaves unchanged.
The conflict rule provides similar class-conflict diagnostics.
These rules cover class strings in the source formats that the Oxlint integration supports.
Retain IntelliSense diagnostics for CSS directives, theme paths, and other editor-only checks.
Report any remaining IntelliSense coverage gaps.
For project blocklists, inspect `no-restricted-classes` and enable it only with the project's actual restrictions.

## Sources

- [Oxlint Tailwind setup and rules](https://oxlint-tailwindcss.pages.dev/setup)
- [Canonical classes](https://oxlint-tailwindcss.pages.dev/rules/enforce-canonical)
- [Scale-token suggestions and IntelliSense](https://oxlint-tailwindcss.pages.dev/rules/prefer-scale-token)
- [Plugin settings and cache](https://oxlint-tailwindcss.pages.dev/settings)
- [Oxfmt integration](https://oxlint-tailwindcss.pages.dev/interop)
- [Maintainer benchmark](https://oxlint-tailwindcss.pages.dev/benchmark)
- [IntelliSense settings](https://github.com/tailwindlabs/tailwindcss-intellisense/blob/main/packages/vscode-tailwindcss/package.json)
- [Tailwind IntelliSense lint rules](https://github.com/tailwindlabs/tailwindcss-intellisense/tree/main/packages/vscode-tailwindcss#linting)
