import type { Dirent } from "fs";
import * as fsPromises from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

const PACKAGES_FILEURL = new URL("../src", import.meta.url);
const README_TPL_FILEURL = new URL("templates/README.md.tpl", import.meta.url);
const ROOT_README_FILEURL = new URL("../README.md", import.meta.url);
const DOCS_PATH = fileURLToPath(new URL("../docs", import.meta.url));
const DOCS_README_PATH = join(DOCS_PATH, "README.md");
const DOCS_SIDEBAR_PATH = join(DOCS_PATH, "_sidebar.md");

// dirs are filtered to be the problem set in aoc 2021
async function packageDirs(): Promise<Dirent[]> {
  const dirs = await fsPromises.readdir(PACKAGES_FILEURL, {
    encoding: "utf-8",
    withFileTypes: true,
  });
  return dirs.filter((dir) => dir.isDirectory() && dir.name.match(/^\d+-.+$/));
}

function capitalize(input: string): string {
  const arr = input.split(" ");
  return arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

async function genDocContent(
  contentPrefix: string,
  problemLinkFn: (name: string) => string,
): Promise<string> {
  const dirs = await packageDirs();

  const problemList = dirs.map((dir) => {
    const folderNameArr = dir.name.split("-");
    const dayNum = folderNameArr.shift();
    return `- [Day ${dayNum} - ${capitalize(folderNameArr.join(" "))}](${problemLinkFn(dir.name)})`;
  });

  return contentPrefix.replace("{{{REPLACEMENT}}}", problemList.join("\n"));
}

async function symlinkProblemReadmes() {
  const dirs = await packageDirs();

  const promises = dirs.map(async (dir) => {
    const targetPath = `../src/${dir.name}/README.md`;
    const symlinkPath = `${DOCS_PATH}/${dir.name}.md`;

    try {
      const fstat = await fsPromises.stat(symlinkPath);
      if (fstat) await fsPromises.rm(symlinkPath);
    } catch (err) {
      // if reaching here most likely `symlinkPath` doesn't exist.
    }

    await fsPromises.symlink(targetPath, symlinkPath, "file");
  });

  await Promise.all(promises);
}

async function main() {
  const readmeTpl = (await fsPromises.readFile(README_TPL_FILEURL, { encoding: "utf-8" })) + "\n";

  console.log("1. Generate root README.md...");
  const rootReadmeContent = await genDocContent(readmeTpl, (dirName) => `./src/${dirName}`);
  await fsPromises.writeFile(ROOT_README_FILEURL, rootReadmeContent);

  console.log("2. Generate docs/README.md...");
  const docsReadmeContent = await genDocContent(readmeTpl, (dirName) => `/${dirName}.md`);
  await fsPromises.writeFile(DOCS_README_PATH, docsReadmeContent);

  console.log("3. Copy over packages README.md to docs...");
  await symlinkProblemReadmes();

  console.log("4. Generate docs/_sidebar.md...");
  const sbPrefix = "- [Home](/)\n{{{REPLACEMENT}}}";
  const sidebarContent = await genDocContent(sbPrefix, (dirName) => `${dirName}.md`);
  await fsPromises.writeFile(DOCS_SIDEBAR_PATH, sidebarContent);
}

main()
  .then(() => {
    console.log("Completed.");
    process.exit(0);
  })
  .catch((err: Error) => {
    console.error("docs-update error:", err);
    process.exit(1);
  });
