# Gerard's Agent Skills

My personal collection of skills for AI agents.

[![skills.sh](https://skills.sh/b/gerardbalaoro/skills)](https://skills.sh/gerardbalaoro/skills)

## Installing a Skill

Install any skill from this repository using the [skills.sh](https://skills.sh/):

<!-- INSTALL:START -->

```bash
npx skills add gerardbalaoro/skills
pnpm dlx skills add gerardbalaoro/skills
bun x skills add gerardbalaoro/skills
```

<!-- INSTALL:END -->

Or, clone the repository and link a skill from your local copy:

```bash
npx skills add .
pnpm dlx skills add .
bun x skills add .
```

## Available Skills

<!-- SKILLS:START -->

### [DevOps](skills/devops/README.md)

Skills for deployment, infrastructure, and service operations.

#### [Dokploy API](skills/devops/dokploy-api/SKILL.md)

Manage Dokploy instances through the HTTP API and Swagger reference. Use when the user mentions Dokploy, Dokploy API, Dokploy Swagger, x-api-key, project.all, application deploys, Compose services, databases, domains, servers, backups, schedules, registries, or CI/CD automation for Dokploy.

### [Engineering](skills/engineering/README.md)

Skills for common developer workflows.

#### [Compose Commits](skills/engineering/compose-commits/SKILL.md)

Compose uncommitted changes, a linear commit range, branch, or PR into logical commits. Use when the user wants to split, clean up, organize, or rewrite commits. Always inspect first, propose a breakdown, get one confirmation, create a backup branch, then rewrite.

#### [Git Conventions](skills/engineering/git-conventions/SKILL.md)

Rules for Git operations: writing commits, naming branches, and writing pull requests.

#### [Setup Gerard's Node Tooling](skills/engineering/setup-gerards-node-tooling/SKILL.md)

Configure Gerard's Node project tooling for a new or existing project.

#### [TypeScript Standards](skills/engineering/typescript-standards/SKILL.md)

TypeScript coding standards. Use when writing, refactoring, or reviewing TypeScript or TSX, including types, naming, imports, control flow, errors, module structure, and tests.

#### [Writing Documentation](skills/engineering/writing-documentation/SKILL.md)

Write, edit, and review technical documentation and code comments. Use to assess documentation needs and keep changes focused on the reader's task.

#### [Writing Tests](skills/engineering/writing-tests/SKILL.md)

Write, refactor, and review tests that catch concrete bugs through real behavior. Use also to assess test value or prune ineffective tests.

### [General](skills/general/README.md)

Skills for general agent workflows and session handoffs.

#### [handoff](skills/general/handoff/SKILL.md)

Compact the current conversation into a handoff document for another agent to pick up.
<!-- SKILLS:END -->

## Contributing

Read [the contribution guidelines](CONTRIBUTING.md).
