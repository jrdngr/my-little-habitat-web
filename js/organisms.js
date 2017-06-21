var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "grid", "helpers"], function (require, exports, grid_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOrganism = function (name, cell) {
        switch (name) {
            case "plant":
                return new Plant(cell);
            case "herbivore":
                return new Herbivore(cell);
            case "parasite":
                return new Parasite(cell);
            default:
                return new Plant(cell);
        }
    };
    var Organism = (function (_super) {
        __extends(Organism, _super);
        function Organism(name, color, cell, behavior) {
            var _this = _super.call(this, name, color, cell) || this;
            _this.behavior = behavior || function () { };
            return _this;
        }
        return Organism;
    }(grid_1.Occupant));
    exports.Organism = Organism;
    var Plant = (function (_super) {
        __extends(Plant, _super);
        function Plant(cell, startEnergy) {
            if (startEnergy === void 0) { startEnergy = 0; }
            var _this = _super.call(this, "plant", "green", cell) || this;
            _this.energy = startEnergy;
            _this.behavior = function (grid) {
                var gridManager = grid;
                if (helpers_1.randomPercentage(1)) {
                    gridManager.cloneRandom(this);
                }
                else {
                    gridManager.addToTurnQueue(this);
                }
            };
            return _this;
        }
        return Plant;
    }(Organism));
    exports.Plant = Plant;
    var Herbivore = (function (_super) {
        __extends(Herbivore, _super);
        function Herbivore(cell, startEnergy) {
            if (startEnergy === void 0) { startEnergy = 50; }
            var _this = _super.call(this, "herbivore", "blue", cell) || this;
            _this.energy = startEnergy;
            _this.behavior = function (grid) {
                var gridManager = grid;
                var neighbors = gridManager.getNeighbors(this);
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                var plantNeighbors = gridManager.getNeighborsOfType(this, "plant");
                if (plantNeighbors.length > 0) {
                    if (this.energy <= 200) {
                        this.energy += 5;
                        gridManager.moveRandom(this, plantNeighbors);
                    }
                    else {
                        this.energy /= 2;
                        gridManager.cloneRandom(this, plantNeighbors);
                    }
                    gridManager.addCellsToTurnQueue(neighbors);
                }
                else {
                    this.energy -= 10;
                    if (helpers_1.randomPercentage(10)) {
                        gridManager.moveRandom(this);
                    }
                    else {
                        gridManager.addToTurnQueue(this);
                    }
                }
            };
            return _this;
        }
        return Herbivore;
    }(Organism));
    exports.Herbivore = Herbivore;
    var Parasite = (function (_super) {
        __extends(Parasite, _super);
        function Parasite(cell, startEnergy) {
            if (startEnergy === void 0) { startEnergy = 10; }
            var _this = _super.call(this, "parasite", "red", cell) || this;
            _this.energy = startEnergy;
            _this.behavior = function (grid) {
                var gridManager = grid;
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                var parasiteNeighbors = gridManager.getNeighborsOfType(this, "parasite", true);
                var plantNeighbors = gridManager.getNeighborsOfType(this, "plant", true);
                if (parasiteNeighbors.length >= 5 || plantNeighbors.length == 0) {
                    this.energy -= 1;
                    gridManager.addToTurnQueue(this);
                }
                else if (parasiteNeighbors.length < 6) {
                    this.energy += 1;
                    gridManager.addToTurnQueue(this);
                }
                if (this.energy > 250) {
                    if (plantNeighbors.length > 0) {
                        this.energy = 1;
                        gridManager.cloneRandom(this, plantNeighbors);
                        gridManager.addCellsToTurnQueue(plantNeighbors);
                    }
                }
            };
            return _this;
        }
        return Parasite;
    }(Organism));
    exports.Parasite = Parasite;
});
//# sourceMappingURL=organisms.js.map