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
define(["require", "exports", "grid", "helpers", "neighbors"], function (require, exports, grid_1, helpers_1, neighbors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getOrganism = function (name) {
        name = name.toLocaleLowerCase();
        switch (name) {
            case "plant":
                return new Plant();
            case "herbivore":
                return new Herbivore();
            default:
                return new Plant();
        }
    };
    var Organism = (function (_super) {
        __extends(Organism, _super);
        function Organism(name, color) {
            return _super.call(this, name, color) || this;
        }
        Organism.prototype.getNeighborsOfType = function (neighbors, name) {
            var result = [];
            neighbors.forEach(function (neighbor) {
                if (neighbor && neighbor.occupant.name == name) {
                    result.push(neighbor);
                }
            });
            return result;
        };
        return Organism;
    }(grid_1.Occupant));
    exports.Organism = Organism;
    var Plant = (function (_super) {
        __extends(Plant, _super);
        function Plant(startEnergy) {
            if (startEnergy === void 0) { startEnergy = 0; }
            var _this = _super.call(this, "plant", "green") || this;
            _this.energy = startEnergy;
            _this.behavior = function (neighbors, grid) {
                if (this.energy < 1) {
                    if (helpers_1.randomInt(0, 100) == 1) {
                        this.energy++;
                    }
                    grid.addToTurnQueue(neighbors[neighbors_1.Neighbor.Self]);
                }
                else {
                    var emptyNeighbors = this.getNeighborsOfType(neighbors, "empty");
                    if (emptyNeighbors.length > 0) {
                        var index = helpers_1.randomInt(0, emptyNeighbors.length);
                        var newX = emptyNeighbors[index].x;
                        var newY = emptyNeighbors[index].y;
                        grid.setOccupant(newX, newY, new Plant());
                        this.energy = 0;
                        grid.addToTurnQueue(neighbors[neighbors_1.Neighbor.Self]);
                    }
                }
            };
            return _this;
        }
        return Plant;
    }(Organism));
    exports.Plant = Plant;
    var Herbivore = (function (_super) {
        __extends(Herbivore, _super);
        function Herbivore(startEnergy) {
            if (startEnergy === void 0) { startEnergy = 100; }
            var _this = _super.call(this, "herbivore", "blue") || this;
            _this.energy = startEnergy;
            _this.behavior = function (neighbors, grid) {
                var x = neighbors[neighbors_1.Neighbor.Self].x;
                var y = neighbors[neighbors_1.Neighbor.Self].y;
                if (this.energy <= 0) {
                    grid.clearCell(x, y);
                }
                else {
                    var plantNeighbors = this.getNeighborsOfType(neighbors, "plant");
                    if (plantNeighbors.length > 0) {
                        var index = helpers_1.randomInt(0, plantNeighbors.length);
                        var newX = plantNeighbors[index].x;
                        var newY = plantNeighbors[index].y;
                        grid.setOccupant(newX, newY, new Herbivore());
                        grid.clearCell(x, y);
                        neighbors.forEach(function (neighbor) {
                            grid.addToTurnQueue(neighbor);
                        });
                    }
                    else {
                        this.energy--;
                        grid.addToTurnQueue(neighbors[neighbors_1.Neighbor.Self]);
                    }
                }
            };
            return _this;
        }
        return Herbivore;
    }(Organism));
    exports.Herbivore = Herbivore;
});
//# sourceMappingURL=organisms.js.map