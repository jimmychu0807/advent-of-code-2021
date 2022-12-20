import { expect } from "chai";

// local import
import { SonarSweep, CountDeltaType } from "./sonar-sweep.js";

function cntObjHelper(obj?: unknown): CountDeltaType {
  if (!obj) return { increasing: 0, noChange: 0, decreasing: 0 };

  return {
    increasing: (obj as CountDeltaType).increasing ?? 0,
    noChange: (obj as CountDeltaType).noChange ?? 0,
    decreasing: (obj as CountDeltaType).decreasing ?? 0,
  };
}

describe("Day 01 - Sonar Sweep", () => {
  describe("Part I", () => {
    it("test for empty input", () => {
      const ss = new SonarSweep([]);
      expect(ss.count()).eql(cntObjHelper(), "empty array should returns 0.");
    });

    it("test for single input", () => {
      const ss = new SonarSweep([100]);
      expect(ss.count()).eql(cntObjHelper(), "empty array should returns 0.");
    });

    it("test for a single increasing case", () => {
      const ss = new SonarSweep([100, 101]);
      expect(ss.count()).eql(cntObjHelper({ increasing: 1 }), "empty array should returns 0.");
    });

    it("test for a single decreasing case", () => {
      const ss = new SonarSweep([100, 99]);
      expect(ss.count()).eql(cntObjHelper({ decreasing: 1 }), "empty array should returns 0.");
    });
  });

  describe("Part II", () => {
    it("test for a complex case with 1 window width", () => {
      const ss = new SonarSweep([100, 99, 100, 101, 105, 100, 98]);
      expect(ss.count()).eql(
        cntObjHelper({ increasing: 3, decreasing: 3 }),
        "empty array should returns 0.",
      );
    });

    it("test for a complex case with 3 window width", () => {
      const ss = new SonarSweep([100, 99, 100, 101, 105, 100, 98]);
      expect(ss.count(3)).eql(
        cntObjHelper({ increasing: 2, noChange: 1, decreasing: 1 }),
        "empty array should returns 0.",
      );
    });
  });
});
