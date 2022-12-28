const getRuleMap = (rules: string[]): Map<string, string> =>
  rules.reduce((map, rule) => {
    const [key, val] = rule.split("->").map((str) => str.trim());
    return map.set(key, val);
  }, new Map());

function freqMaxMinDiff(freqMap: Map<string, number>): number {
  let max: number | undefined = undefined;
  let min: number | undefined = undefined;

  freqMap.forEach((val) => {
    if (!max || val > max) max = val;
    if (!min || val < min) min = val;
  });

  if (typeof max !== "number" || typeof min !== "number") {
    throw new Error("freqMap passed in freqMaxMinDiff() is empty.");
  } else {
    return max - min;
  }
}

class ExtendedPolymerization {
  static extendPolymer(initPolymer: string, rules: string[], step: number): string {
    // craete the rule maps
    const ruleMap: Map<string, string> = getRuleMap(rules);
    let currPolymer: string = initPolymer;

    for (let currStep = step; currStep > 0; currStep--) {
      currPolymer = currPolymer
        .split("")
        .slice(0, -1) // remove the last element
        .map((el, idx) => `${el}${currPolymer.charAt(idx + 1)}`) // combine into two chars long
        .map((el) => (ruleMap.has(el) ? `${el.charAt(0)}${ruleMap.get(el)}${el.charAt(1)}` : el)) // apply the pair insertion rule
        .map((str, idx) => (idx === 0 ? str : str.slice(1)))
        .join("");
    }
    return currPolymer;
  }

  static getFreqMap(polymer: string): Map<string, number> {
    return polymer
      .split("")
      .reduce((map, char) => map.set(char, map.has(char) ? map.get(char) + 1 : 1), new Map());
  }
}

export { ExtendedPolymerization as default, freqMaxMinDiff };
