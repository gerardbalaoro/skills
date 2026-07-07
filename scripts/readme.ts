import { Glob } from "bun";
import matter from "gray-matter";
import packageJson from "../package.json" with { type: "json" };

type Skill = {
  name: string;
  description: string;
  domain: string;
  path: string;
};

const repository = packageJson.name.replace(/^@/, "");
const formatDomain = (domain: string) =>
  domain === "devops"
    ? "DevOps"
    : domain.replace(/(^|-)(\w)/g, (_, prefix, char) => `${prefix}${char.toUpperCase()}`);
const renderSkill = (skill: Skill) => `#### [${skill.name}](skills/${skill.path}/SKILL.md)\n\n${skill.description}`;

const skills = await (async () => {
  const skills: Skill[] = [];

  for await (const source of new Glob("skills/**/SKILL.md").scan(".")) {
    const content = await Bun.file(source).text();
    const { name, description } = matter(content).data;
    const path = source.replace(/^skills\//, "").replace(/\/SKILL\.md$/, "");
    const [domain = "uncategorized"] = path.split("/");

    if (!name || !description || !path) {
      continue;
    }

    skills.push({ name, description, domain, path });
  }

  return skills.sort(
    (a, b) => a.domain.localeCompare(b.domain) || a.name.localeCompare(b.name),
  );
})();

const readme = async (path: string) => {
  const source = await Bun.file(path).text();

  return (sections: Record<string, string>) => {
    const content = Object.entries(sections).reduce((content, [section, value]) => {
      const start = `<!-- ${section}:START -->`;
      const end = `<!-- ${section}:END -->`;
      const pattern = new RegExp(`${start}[\\s\\S]*?${end}`);
      const replacement = `${start}\n${value}\n${end}`;

      if (pattern.test(content)) {
        return content.replace(pattern, replacement);
      }

      return `${content.trimEnd()}\n\n${replacement}\n`;
    }, source);

    return Bun.write(path, content);
  };
};

await readme("README.md").then((write) => {
  const installer = (skill?: string) => {
    const cmd = ["npx", "pnpm dlx", "bun x"];
    const args = ["skills", "add", repository, skill ? `--skill ${skill}` : undefined]
      .filter(Boolean)
      .join(" ");

    return `\`\`\`bash\n${cmd.map((c) => `${c} ${args}`).join("\n")}\n\`\`\``;
  };
  const skillsByDomain = Map.groupBy(skills, (skill) => skill.domain);

  return write({
    INSTALL: installer(),
    SKILLS:
      skills.length === 0
        ? "_No skills found. Add a skill to the `skills/` directory to get started._"
        : [...skillsByDomain]
            .map(
              ([domain, skills]) =>
                `### ${formatDomain(domain)}\n\n${skills.map(renderSkill).join("\n\n")}`,
            )
            .join("\n\n"),
  });
});

console.log(`Updated README.md with ${skills.length} skill(s).`);
