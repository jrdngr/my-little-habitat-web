define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function randomInt(min, max) {
        max = Math.floor(max);
        min = Math.ceil(min);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    exports.randomInt = randomInt;
    function randomSignedUnit() {
        return 2 * randomInt(0, 2) - 1;
    }
    exports.randomSignedUnit = randomSignedUnit;
    function randomPercentage(percentageAsInteger) {
        return Math.random() < (percentageAsInteger / 100);
    }
    exports.randomPercentage = randomPercentage;
});
//# sourceMappingURL=helpers.js.map