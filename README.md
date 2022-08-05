# Advent of Code 2021

[![Known Vulnerabilities](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021/badge.svg)](https://snyk.io/test/github/jimmychu0807/advent-of-code-2021) [![npm version](https://badge.fury.io/js/@aoc-2021%2Fcli.svg)](https://badge.fury.io/js/@aoc-2021%2Fcli)

This is my attempt on [Advent of Code 2021](https://adventofcode.com/2021) :rocket:

- [Day 01 - Sonar Sweep](./packages/01-sonar-sweep)
- [Day 02 - Dive](./packages/02-dive)
- [Day 03 - Binary Diagnostic](./packages/03-binary-diagnostic)
- [Day 04 - Giant Squid](./packages/04-giant-squid)

## Workflow

**Normal run**

```bash
yarn install
# More help text will be displayed
yarn cli
```

Note when entering input file in relative path in `yarn cli`, the path is relative to `packages/cli` directory, not the current user directory.

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

