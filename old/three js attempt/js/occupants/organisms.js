var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function getNeighborsOfType(neighbors, type) {
    var matchingNeighbors = [];
    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i] != null) {
            if (neighbors[i].occupant == null && type == null) {
                matchingNeighbors.push(neighbors[i]);
            }
            else if (neighbors[i].occupant != null && neighbors[i].occupant.name == type) {
                matchingNeighbors.push(neighbors[i]);
            }
        }
    }
    return matchingNeighbors;
}
var Organism = (function (_super) {
    __extends(Organism, _super);
    function Organism(name, color, startingEnergy) {
        var _this = _super.call(this, name, color) || this;
        _this.energy = startingEnergy || 0;
        return _this;
    }
    return Organism;
}(Occupant));
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall() {
        var _this = _super.call(this, "wall", "black") || this;
        _this.behavior = function () { };
        return _this;
    }
    return Wall;
}(Organism));
var plantParameters = {
    energyAddedPerTick: 1,
    energyToSplit: 18,
};
var Plant = (function (_super) {
    __extends(Plant, _super);
    function Plant() {
        var _this = _super.call(this, "plant", "green") || this;
        _this.behavior = function (neighbors) {
            this.energy += plantParameters.energyAddedPerTick;
            if (this.energy >= plantParameters.energyToSplit) {
                this.energy = 0;
                var emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
                if (emptyNeighbors.length > 0) {
                    var direction = randomInt(0, emptyNeighbors.length);
                    var target = emptyNeighbors[direction];
                    target.setOccupant(new Plant());
                    target.skip();
                }
            }
        };
        return _this;
    }
    return Plant;
}(Organism));
var herbivoreParameters = {
    energyLostPerTick: 1,
    energyToSplit: 100,
    energyLostToParasite: 5,
    energyFromVines: 1,
    defaultStartingEnergy: 50
};
var Herbivore = (function (_super) {
    __extends(Herbivore, _super);
    function Herbivore(startingEnergy) {
        var _this = _super.call(this, "herbivore", "blue") || this;
        _this.energy = startingEnergy || herbivoreParameters.defaultStartingEnergy;
        _this.behavior = function (neighbors) {
            this.energy -= herbivoreParameters.energyLostPerTick;
            if (this.energy <= 0) {
                neighbors.myself.setOccupant(null);
                return;
            }
            var plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
            if (plantNeighbors.length > 0) {
                var direction = randomInt(0, plantNeighbors.length);
                var target = plantNeighbors[direction];
                if (this.energy > herbivoreParameters.energyToSplit) {
                    target.setOccupant(new Herbivore(Math.floor(this.energy / 2) + target.occupant.energy));
                    target.skip();
                    neighbors.myself.setOccupant(new Herbivore(Math.floor(this.energy / 2)));
                }
                else {
                    target.setOccupant(new Herbivore(this.energy + target.occupant.energy));
                    target.skip();
                    neighbors.myself.setOccupant(null);
                }
                return;
            }
            var vineNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "vine");
            if (vineNeighbors.length > 0) {
                var direction = randomInt(0, vineNeighbors.length);
                var target = vineNeighbors[direction];
                target.setOccupant(null);
                this.energy += herbivoreParameters.energyFromVines;
                return;
            }
            var parasiteNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "parasite");
            if (parasiteNeighbors.length > 0) {
                var direction = randomInt(0, parasiteNeighbors.length);
                var target = parasiteNeighbors[direction];
                target.setOccupant(null);
                this.energy -= herbivoreParameters.energyLostToParasite;
                return;
            }
            var emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
            if (emptyNeighbors.length > 0) {
                var direction = randomInt(0, emptyNeighbors.length);
                var target = emptyNeighbors[direction];
                target.setOccupant(new Herbivore(this.energy - 10));
                target.skip();
                neighbors.myself.setOccupant(null);
            }
        };
        return _this;
    }
    return Herbivore;
}(Organism));
var parasiteParameters = {
    defaultStartingEnergy: 1,
    parasiteOverpopulation: 5,
    energyLostToOverpopulation: 1,
    gainEnergyIfPopUnder: 6,
    energyAddedPerTick: 1,
    energyToSplit: 50
};
var Parasite = (function (_super) {
    __extends(Parasite, _super);
    function Parasite(startingEnergy) {
        var _this = _super.call(this, "parasite", "red") || this;
        _this.energy = startingEnergy || parasiteParameters.defaultStartingEnergy;
        _this.behavior = function (neighbors) {
            if (this.energy <= 0) {
                neighbors.myself.setOccupant(null);
                return;
            }
            var parasiteNeighbors = getNeighborsOfType(neighbors.arr, "parasite");
            var plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
            if (parasiteNeighbors.length >= parasiteParameters.parasiteOverpopulation || plantNeighbors.length == 0) {
                this.energy -= parasiteParameters.energyLostToOverpopulation;
                return;
            }
            else if (parasiteNeighbors.length < parasiteParameters.gainEnergyIfPopUnder) {
                this.energy += parasiteParameters.energyAddedPerTick;
            }
            if (this.energy > parasiteParameters.energyToSplit) {
                if (plantNeighbors.length > 0) {
                    var direction = randomInt(0, plantNeighbors.length);
                    var target = plantNeighbors[direction];
                    target.setOccupant(new Parasite(target.occupant.energy));
                    target.skip();
                    neighbors.myself.setOccupant(new Parasite());
                    return;
                }
            }
        };
        return _this;
    }
    return Parasite;
}(Organism));
var vineParameters = {
    defaultStartingEnergy: 0,
    energyAddedPerTick: 1,
    maxVineNeighborsToSplit: 3,
    energyToSplit: 50
};
var Vine = (function (_super) {
    __extends(Vine, _super);
    function Vine() {
        var _this = _super.call(this, "vine", "purple") || this;
        _this.energy = vineParameters.defaultStartingEnergy;
        _this.behavior = function (neighbors) {
            var vineNeighbors = getNeighborsOfType(neighbors.arr, "vine");
            if (vineNeighbors.length < vineParameters.maxVineNeighborsToSplit && this.energy > vineParameters.energyToSplit) {
                this.energy = 0;
                if (vineNeighbors.length > 0) {
                    var direction = void 0;
                    var neighborArray = neighbors.arr;
                    for (var i = 0; i < neighborArray.length; i++) {
                        if (neighborArray[i] != null && neighborArray[i].occupant != null && neighborArray[i].occupant.name == "vine") {
                            direction = i + 3;
                        }
                    }
                    direction += randomInt(0, 3);
                    direction = direction % 8;
                    var target = neighborArray[direction];
                    if (target != null && target.occupant != null && target.occupant.name == "plant") {
                        target.setOccupant(new Vine());
                        target.skip();
                        neighbors.myself.setOccupant(new Vine());
                    }
                    return;
                }
                else {
                    var plantNeighbors = getNeighborsOfType(neighbors.arr, "plant");
                    if (plantNeighbors.length > 0) {
                        var direction = randomInt(0, plantNeighbors.length);
                        var target = plantNeighbors[direction];
                        target.setOccupant(new Vine());
                        target.skip();
                        neighbors.myself.setOccupant(new Vine());
                        return;
                    }
                }
            }
            else {
                this.energy += vineParameters.energyAddedPerTick;
            }
        };
        return _this;
    }
    return Vine;
}(Organism));
//# sourceMappingURL=organisms.js.map