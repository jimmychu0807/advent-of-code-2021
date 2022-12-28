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

function addToMap<K>(map: Map<K, number>, k: K, v: number): Map<K, number> {
  return map.set(k, map.has(k) ? (map.get(k) as number) + v : v);
}

class ExtendedPolymerization {
  static extendPolymerStr(initPolymer: string, rules: string[], step: number): string {
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

  static extendPolymerMap(initPolymer: string, rules: string[], step: number): Map<string, number> {
    // craete the rule maps
    const ruleMap: Map<string, string> = getRuleMap(rules);

    // convert initPolymer to map frequency
    let polymerMap = this.toPolymerMap(initPolymer);

    for (let currStep = step; currStep > 0; currStep--) {
      const map = new Map<string, number>();

      polymerMap.forEach((val, key) => {
        if (ruleMap.has(key)) {
          const key1 = `${key.charAt(0)}${ruleMap.get(key)}`;
          const key2 = `${ruleMap.get(key)}${key.charAt(1)}`;
          addToMap(map, key1, val);
          addToMap(map, key2, val);
        } else {
          addToMap(map, key, val);
        }
      });

      polymerMap = map;
    }

    return polymerMap;
  }

  static toPolymerMap(polymer: string): Map<string, number> {
    return polymer
      .split("")
      .slice(0, -1)
      .map((el, idx) => `${el}${polymer.charAt(idx + 1)}`)
      .reduce((map, seg) => addToMap(map, seg, 1), new Map());
  }

  static getFreqMapFromStr(polymer: string): Map<string, number> {
    return polymer
      .split("")
      .reduce((map, char) => map.set(char, map.has(char) ? map.get(char) + 1 : 1), new Map());
  }

  static getFreqMapFromMap(polygonMap: Map<string, number>, pm: string): Map<string, number> {
    const freqMap = new Map();
    polygonMap.forEach((v, k) => {
      addToMap(freqMap, k.charAt(0), v);
    });

    // We need the original polymer string to determine the last character
    return addToMap(freqMap, pm.charAt(pm.length - 1), 1);
  }
}

export { ExtendedPolymerization as default, freqMaxMinDiff, addToMap };
