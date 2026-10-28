# shadcn Lint Integration

Use `@shadcn/lint` for Tailwind v4 design systems with a component directory and theme.
The plugin also supports component libraries that do not use shadcn/ui.
For other projects, omit this integration.
For canonical classes, variant order, and conflict warnings, also use [the Tailwind class checks](tailwind.md).

## Dependencies and Configuration

Install `@shadcn/lint` as a development dependency through the selected package manager.
Make sure that the runtime and Oxlint versions meet the plugin's current requirements.
Use Ultracite's shadcn preset to configure the plugin and its rules together:

```ts
import { defineConfig } from "oxlint";
import antiSlop from "ultracite/oxlint/anti-slop";
import core from "ultracite/oxlint/core";
import shadcn from "ultracite/oxlint/shadcn";

export default defineConfig({
  extends: [core, antiSlop, shadcn],
  ignorePatterns: core.ignorePatterns,
  jsPlugins: shadcn.jsPlugins,
});
```

Merge this example with the project's other applicable presets and root plugin registrations.
The anti-slop preset registers its bundled plugin through `extends`.
The root shadcn registration also lets dependency analyzers find the external `@shadcn/lint` dependency.
Run these rules through `oxlint` with the other rules.

## Scale Suggestions and Canonical Classes

`shadcn/no-arbitrary-values` already suggests equivalent theme tokens and spacing-scale classes.
The Ultracite preset exempts layout values, so arbitrary margins do not produce these suggestions by default.
To warn on those values, override the rule with `["warn", { allow: [] }]`.
Account for the preset's component-directory exclusions before claiming coverage there.

This rule also reports arbitrary values without an equivalent class.
It does not provide general canonical-spelling or class-conflict checks.
Use the separate Tailwind integration for those checks.
Avoid duplicate scale warnings through the selected rules' file overrides and class allowances.

## Component and Theme Discovery

Use the project's `components.json`, component paths, and theme to determine discovery requirements.
For custom component imports, configure `settings.shadcn.ui` on the root Oxlint configuration.
For custom class helpers, configure `settings.shadcn.mergeFunctions` and `settings.shadcn.variantFunctions`.
Compare discovery coverage before removing another plugin's unknown-class rule.
Oxlint does not merge `settings` from extended configurations.
For monorepos, preserve each app's component imports and theme discovery.

Preserve the preset's exceptions for files inside the component library.
For custom component directories, adapt those exceptions to the actual paths.
Keep design-system enforcement active for code that consumes the components.

## Sources

- [shadcn lint setup and discovery](https://github.com/shadcn-ui/lint/blob/main/README.md)
- [Existing scale suggestions and layout exemptions](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-arbitrary-values.md)
- [Ultracite's shadcn preset](https://github.com/haydenbleasel/ultracite/blob/main/packages/cli/config/oxlint/shadcn/index.mjs)
