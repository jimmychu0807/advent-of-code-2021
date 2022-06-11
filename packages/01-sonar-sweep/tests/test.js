"use strict";
exports.__esModule = true;
var assert = require("assert");
var SonarSweep_1 = require("../src/SonarSweep");
describe('SonarSweep test', function () {
    it('should returns 0 for empty input', function () {
        var ss = new SonarSweep_1["default"]([]);
        assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.");
    });
    it('should returns 0 for single input', function () {
        var ss = new SonarSweep_1["default"]([100]);
        assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.");
    });
    it('should return 1 in simple case', function () {
        var ss = new SonarSweep_1["default"]([100, 101]);
        assert.equal(ss.countIncreasing(), 1, "empty array should returns 0.");
    });
    it('should return 0 in simple case', function () {
        var ss = new SonarSweep_1["default"]([100, 99]);
        assert.equal(ss.countIncreasing(), 0, "empty array should returns 0.");
    });
    it('should return 3 in a more complex case', function () {
        var ss = new SonarSweep_1["default"]([100, 99, 100, 101, 105, 100, 98]);
        assert.equal(ss.countIncreasing(), 3, "empty array should returns 0.");
    });
});
