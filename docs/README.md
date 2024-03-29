# Advent of Code 2021

[![Known Vulnerabilities](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021/badge.svg)](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021) [![npm version](https://badge.fury.io/js/@jimmychu0807%2Faoc-2021.svg)](https://badge.fury.io/js/@jimmychu0807%2Faoc-2021)

This is my attempt on [Advent of Code 2021](https://adventofcode.com/2021) :rocket:

- [Day 01 - Sonar Sweep](/01-sonar-sweep.md)
- [Day 02 - Dive](/02-dive.md)
- [Day 03 - Binary Diagnostic](/03-binary-diagnostic.md)
- [Day 04 - Giant Squid](/04-giant-squid.md)
- [Day 05 - Hydrothermal Venture](/05-hydrothermal-venture.md)
- [Day 06 - Latternfish](/06-latternfish.md)
- [Day 07 - Trechery Of Whales](/07-trechery-of-whales.md)
- [Day 08 - Seven Segment Search](/08-seven-segment-search.md)
- [Day 09 - Smoke Basin](/09-smoke-basin.md)
- [Day 10 - Syntax Scoring](/10-syntax-scoring.md)
- [Day 11 - Dumbo Octopus](/11-dumbo-octopus.md)
- [Day 12 - Passage Pathing](/12-passage-pathing.md)
- [Day 13 - Transparent Origami](/13-transparent-origami.md)
- [Day 14 - Extended Polymerization](/14-extended-polymerization.md)
- [Day 15 - Chiton](/15-chiton.md)
- [Day 16 - Packet Decoder](/16-packet-decoder.md)
- [Day 17 - Trick Shot](/17-trick-shot.md)
- [Day 18 - Snailfish](/18-snailfish.md)
- [Day 19 - Beacon Scanner](/19-beacon-scanner.md)
- [Day 20 - Trench Map](/20-trench-map.md)
- [Day 21 - Dirac Dice](/21-dirac-dice.md)
- [Day 22 - Reactor Reboot](/22-reactor-reboot.md)
- [Day 23 - Amphipod](/23-amphipod.md)
- [Day 24 - Arithmetic Logic Unit](/24-arithmetic-logic-unit.md)
- [Day 25 - Sea Cucumber](/25-sea-cucumber.md)

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

