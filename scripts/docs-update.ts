import type { Dirent } from 'fs'
import * as fsPromises from 'fs/promises'
import * as path from 'path'

const PACKAGES_PATH = path.join(__dirname, '..', 'src')
const README_TPL_PATH = path.join(__dirname, 'templates', 'README.md.tpl')
const ROOT_README_PATH = path.join(__dirname, '..', 'README.md')
const DOCS_PATH = path.join(__dirname, '..', 'docs')
const DOCS_README_PATH = path.join(DOCS_PATH, 'README.md')
const DOCS_SIDEBAR_PATH = path.join(DOCS_PATH, '_sidebar.md')

// dirs are filtered to be the problem set in aoc 2021
async function packageDirs(): Promise<Dirent[]> {
  const dirs = await fsPromises.readdir(PACKAGES_PATH, { encoding: 'utf-8', withFileTypes: true })
  return dirs.filter((dir) => dir.isDirectory() && dir.name.match(/^\d+-.+$/))
}

function capitalize(input: string): string {
  const arr = input.split(' ')
  return arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

async function genDocContent(
  contentPrefix: string,
  problemLinkFn: (name: string) => string
): Promise<string> {
  const dirs = await packageDirs()

  const problemList = dirs.map((dir) => {
    const folderNameArr = dir.name.split('-')
    const dayNum = folderNameArr.shift()
    return `- [Day ${dayNum} - ${capitalize(folderNameArr.join(' '))}](${problemLinkFn(dir.name)})`
  })

  return contentPrefix.replace('{{{REPLACEMENT}}}', problemList.join('\n'))
}

async function symlinkProblemReadmes() {
  const dirs = await packageDirs()

  const promises = dirs.map(async (dir) => {
    const targetPath = `../src/${dir.name}/README.md`
    const symlinkPath = `${DOCS_PATH}/${dir.name}.md`

    try {
      const fstat = await fsPromises.stat(symlinkPath)
      if (fstat) await fsPromises.rm(symlinkPath)
    } catch (err) {
      // if reaching here most likely `symlinkPath` doesn't exist.
    }

    await fsPromises.symlink(targetPath, symlinkPath, 'file')
  })

  await Promise.all(promises)
}

async function main() {
  const readmeTpl = (await fsPromises.readFile(README_TPL_PATH, { encoding: 'utf-8' })) + '\n'

  console.log('1. Generate root README.md...')
  const rootReadmeContent = await genDocContent(readmeTpl, (dirName) => `./src/${dirName}`)
  await fsPromises.writeFile(ROOT_README_PATH, rootReadmeContent)

  console.log('2. Generate docs/README.md...')
  const docsReadmeContent = await genDocContent(readmeTpl, (dirName) => `/${dirName}.md`)
  await fsPromises.writeFile(DOCS_README_PATH, docsReadmeContent)

  console.log('3. Copy over packages README.md to docs...')
  await symlinkProblemReadmes()

  console.log('4. Generate docs/_sidebar.md...')
  const sbPrefix = '- [Home](/)\n{{{REPLACEMENT}}}'
  const sidebarContent = await genDocContent(sbPrefix, (dirName) => `${dirName}.md`)
  await fsPromises.writeFile(DOCS_SIDEBAR_PATH, sidebarContent)
}

main()
  .then(() => {
    console.log('Completed.')
    process.exit(0)
  })
  .catch((err: Error) => {
    console.error('docs-update error:', err)
    process.exit(1)
  })
