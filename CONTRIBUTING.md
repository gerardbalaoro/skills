# Contributing

Run `bun install` to install dependencies and the Lefthook pre-commit hook.

Skills are discovered from `skills/`. A skill belongs to a group, or sits at the top level without one.

1. Add a group (optional): create `skills/<group>/README.md` with a `#` title and a one-sentence description.
2. Add a skill: create `skills/<group>/<skill>/SKILL.md`, or `skills/<skill>/SKILL.md` for an ungrouped skill. Give it `name` and `description` frontmatter.
3. Run `bun run readme && bun run manifest` to regenerate the lists below.

Generated files (edits inside the markers are overwritten):

- `README.md`: the skills list between `SKILLS:START` and `SKILLS:END`
- `skills/<group>/README.md`: the skill list for that group
- `skills.sh.json`: the groupings for skills.sh

The pre-commit hook runs both generators before formatting staged files. It refreshes the catalogs on every commit, including skill deletions and generator changes.

If the hook reports unstaged catalog inputs, stage or stash those files before committing. This guard keeps uncommitted input out of generated catalogs.

Run `bun run format` to format the repository. Run `bun run format:check` and `bun run typecheck` to check the setup.
