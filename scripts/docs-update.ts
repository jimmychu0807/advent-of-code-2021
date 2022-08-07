import * as fs from 'fs'
import * as path from 'path'

const PACKAGES_PATH = path.join(__dirname, '/../packages')
const README_TPL_PATH = path.join(__dirname, '/templates/README.md.tpl')
const ROOT_README_PATH = path.join(__dirname, '/../README.md')
const DOCS_PATH = path.join(__dirname, '/../docs')
const DOCS_README_PATH = path.join(DOCS_PATH, '/README.md')
const DOCS_SIDEBAR_PATH = path.join(DOCS_PATH, '/_sidebar.md')

// dirs are filtered to be the problem set in aoc 2021
const packageDirs = (): fs.Dirent[] =>
  fs
    .readdirSync(PACKAGES_PATH, { encoding: 'utf-8', withFileTypes: true })
    .filter((dir) => dir.isDirectory() && dir.name.match(/^\d+-.+$/))

function capitalize(input: string): string {
  const arr = input.split(' ')
  return arr.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function genDocContent(contentPrefix: string, problemLinkFn: (name: string) => string): string {
  const dirs = packageDirs()

  const problemList = dirs.map((dir) => {
    const folderNameArr = dir.name.split('-')
    const dayNum = folderNameArr.shift()
    return `- [Day ${dayNum} - ${capitalize(folderNameArr.join(' '))}](${problemLinkFn(dir.name)})`
  })

  return contentPrefix.replace('{{{REPLACEMENT}}}', problemList.join('\n'))
}

function copyPackagesReadmeOver(): void {
  const dirs = packageDirs()

  dirs.forEach((dir) => {
    const packageReadmePath = `${PACKAGES_PATH}/${dir.name}/README.md`
    const destPath = `${DOCS_PATH}/${dir.name}.md`
    fs.copyFileSync(packageReadmePath, destPath)
  })
}

// --- Program starts ---

const readmeTpl = fs.readFileSync(README_TPL_PATH, { encoding: 'utf-8' }) + '\n'

console.log('1. Generate root README.md...')
const rootReadmeContent = genDocContent(readmeTpl, (dirName) => `./packages/${dirName}`)
fs.writeFileSync(ROOT_README_PATH, rootReadmeContent)

console.log('2. Generate docs/README.md...')
const docsReadmeContent = genDocContent(readmeTpl, (dirName) => `/${dirName}.md`)
fs.writeFileSync(DOCS_README_PATH, docsReadmeContent)

console.log('3. Copy over packages README.md to docs...')
copyPackagesReadmeOver()

console.log('4. Generate docs/_sidebar.md...')
const sbPrefix = '- [Home](/)\n{{{REPLACEMENT}}}'
const sidebarContent = genDocContent(sbPrefix, (dirName) => `${dirName}.md`)
fs.writeFileSync(DOCS_SIDEBAR_PATH, sidebarContent)
