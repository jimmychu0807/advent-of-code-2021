# Advent of Code 2021

[![Known Vulnerabilities](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021/badge.svg)](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021) [![npm version](https://badge.fury.io/js/@jimmychu0807%2Faoc-2021.svg)](https://badge.fury.io/js/@jimmychu0807%2Faoc-2021)

This is my attempt on [Advent of Code 2021](https://adventofcode.com/2021) :rocket:

- [Day 01 - Sonar Sweep](./src/01-sonar-sweep)
- [Day 02 - Dive](./src/02-dive)
- [Day 03 - Binary Diagnostic](./src/03-binary-diagnostic)
- [Day 04 - Giant Squid](./src/04-giant-squid)
- [Day 05 - Hydrothermal Venture](./src/05-hydrothermal-venture)
- [Day 06 - Latternfish](./src/06-latternfish)
- [Day 07 - Trechery Of Whales](./src/07-trechery-of-whales)
- [Day 08 - Seven Segment Search](./src/08-seven-segment-search)
- [Day 09 - Smoke Basin](./src/09-smoke-basin)
- [Day 10 - Syntax Scoring](./src/10-syntax-scoring)
- [Day 11 - Dumbo Octopus](./src/11-dumbo-octopus)
- [Day 12 - Passage Pathing](./src/12-passage-pathing)
- [Day 13 - Transparent Origami](./src/13-transparent-origami)
- [Day 14 - Extended Polymerization](./src/14-extended-polymerization)
- [Day 15 - Chiton](./src/15-chiton)
- [Day 16 - Packet Decoder](./src/16-packet-decoder)
- [Day 17 - Trick Shot](./src/17-trick-shot)
- [Day 18 - Snailfish](./src/18-snailfish)
- [Day 19 - Beacon Scanner](./src/19-beacon-scanner)
- [Day 20 - Trench Map](./src/20-trench-map)
- [Day 21 - Dirac Dice](./src/21-dirac-dice)
- [Day 22 - Reactor Reboot](./src/22-reactor-reboot)
- [Day 23 - Amphipod](./src/23-amphipod)
- [Day 24 - Arithmetic Logic Unit](./src/24-arithmetic-logic-unit)
- [Day 25 - Sea Cucumber](./src/25-sea-cucumber)

## Workflow

**Normal run**

```bash
yarn install
# More help text will be displayed
yarn cli <sub-command> <input argument>
# Example
yarn cli sonar-sweep -i src/01-sonar-sweep/input/input.dat
```

**For CI**

```bash
yarn install
# More help text will be displayed
yarn validate
```

**For docs generation**

```bash
yarn docs:update
# Preview docs
yarn docs:serve
```

- Do not update the root [`README.md`](https://github.com/jimmychu0807/advent-of-code-2021/blob/main/README.md) directly. Instead update [`scripts/templates/README.md.tpl`](https://github.com/jimmychu0807/advent-of-code-2021/blob/main/scripts/templates/README.md.tpl) as `scripts/doc-update.ts` will auto-generate the doc based on this template.

**For publishing packages**

```bash
# Contributor

yarn changeset add
yarn changeset version
yarn install
git add .
git commit -m "message"
git push <repo>
# Pull request to remote repo base branch

# Repo owner

# (Squash) Merge PR from contributor to base branch
yarn changeset publish
git push --follow-tags
```

For detail refer to: <https://github.com/changesets/changesets/blob/main/packages/cli/README.md>

