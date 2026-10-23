import { spawnSync } from "node:child_process";

const inputs = [
  "README.md",
  "skills.sh.json",
  "package.json",
  "oxfmt.config.ts",
  "scripts/",
  ":(glob)skills/**/SKILL.md",
  ":(glob)skills/*/README.md",
];

const changedFiles = (args: string[]) => {
  const result = spawnSync("git", [...args, "-z", "--", ...inputs], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || "Could not check catalog inputs.");
  }
  return result.stdout.split("\0").filter(Boolean);
};

const unstaged = changedFiles(["diff", "--name-only"]);
const untracked = changedFiles(["ls-files", "--others", "--exclude-standard"]);
const paths = [...new Set([...unstaged, ...untracked])].sort();

if (paths.length > 0) {
  console.error("Stage or stash these catalog inputs before committing:");
  for (const path of paths) {
    console.error(`  ${path}`);
  }
  process.exit(1);
}
