# Gerard's Agent Skills

My personal collection of skills for AI agents.

## Installing a Skill

Install any skill from this repository using the [skills.sh](https://skills.sh/):

<!-- INSTALL:START -->
```bash
npx skills add gerardbalaoro/skills
pnpm dlx skills add gerardbalaoro/skills
bun x skills add gerardbalaoro/skills
```
<!-- INSTALL:END -->

## Available Skills

<!-- SKILLS:START -->
### DevOps

#### [dokploy-api](skills/devops/dokploy-api/SKILL.md)

Manage Dokploy instances through the HTTP API and Swagger reference. Use when the user mentions Dokploy, Dokploy API, Dokploy Swagger, x-api-key, project.all, application deploys, Compose services, databases, domains, servers, backups, schedules, registries, or CI/CD automation for Dokploy.

### Engineering

#### [compose-commits](skills/engineering/compose-commits/SKILL.md)

Compose uncommitted changes, a linear commit range, branch, or PR into logical commits. Use when the user wants to split, clean up, organize, or rewrite commits. Always inspect first, propose a breakdown, get one confirmation, create a backup branch, then rewrite.
<!-- SKILLS:END -->

## Contributing

1. Create a new directory under `skills/<domain>/` with your skill name
2. Add a `SKILL.md` file with the required frontmatter (`name`, `description`)
3. Run `bun ./scripts/readme.ts` to update the skills list above
