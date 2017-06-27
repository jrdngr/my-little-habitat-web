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
    function integerSequence(min, max, step = 1) {
        let result = [];
        max += 1;
        for (let i = min; i < max; i += step) {
            result.push(i);
        }
        return result;
    }
    exports.integerSequence = integerSequence;
    function randomOrdering(elements) {
        let swap = function (array, firstIndex, secondIndex) {
            let temp = array[firstIndex];
            array[firstIndex] = array[secondIndex];
            array[secondIndex] = temp;
        };
        for (let i = 0; i < elements.length; i++) {
            swap(elements, randomInt(0, elements.length), randomInt(0, elements.length));
        }
        return elements;
    }
    exports.randomOrdering = randomOrdering;
});
//# sourceMappingURL=helpers.js.map