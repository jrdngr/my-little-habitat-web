var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
function getNeighborsOfType(neighbors, type) {
    var matchingNeighbors = [];
    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i] != null) {
            if (neighbors[i].organism == null && type == null) {
                matchingNeighbors.push(neighbors[i]);
            }
            else if (neighbors[i].organism != null && neighbors[i].organism.name == type) {
                matchingNeighbors.push(neighbors[i]);
            }
        }
    }
    return matchingNeighbors;
}
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
            this.energy += plantParameters["energyAddedPerTick"];
            if (this.energy >= plantParameters["energyToSplit"]) {
                this.energy = 0;
                var emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
                if (emptyNeighbors.length > 0) {
                    var direction = randomInt(0, emptyNeighbors.length);
                    var target = emptyNeighbors[direction];
                    target.setOrganism(new Plant());
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
        _this.energy = startingEnergy || herbivoreParameters["defaultStartingEnergy"];
        _this.behavior = function (neighbors) {
            this.energy -= herbivoreParameters["energyLostPerTick"];
            if (this.energy <= 0) {
                neighbors.myself.setOrganism(null);
                return;
            }
            var plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
            if (plantNeighbors.length > 0) {
                var direction = randomInt(0, plantNeighbors.length);
                var target = plantNeighbors[direction];
                if (this.energy > herbivoreParameters["energyToSplit"]) {
                    target.setOrganism(new Herbivore(Math.floor(this.energy / 2) + target.organism.energy));
                    target.skip();
                    neighbors.myself.setOrganism(new Herbivore(Math.floor(this.energy / 2)));
                }
                else {
                    target.setOrganism(new Herbivore(this.energy + target.organism.energy));
                    target.skip();
                    neighbors.myself.setOrganism(null);
                }
                return;
            }
            var vineNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "vine");
            if (vineNeighbors.length > 0) {
                var direction = randomInt(0, vineNeighbors.length);
                var target = vineNeighbors[direction];
                target.setOrganism(null);
                this.energy += herbivoreParameters["energyFromVines"];
                return;
            }
            var parasiteNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "parasite");
            if (parasiteNeighbors.length > 0) {
                var direction = randomInt(0, parasiteNeighbors.length);
                var target = parasiteNeighbors[direction];
                target.setOrganism(null);
                this.energy -= herbivoreParameters["energyLostToParasite"];
                return;
            }
            var emptyNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), null);
            if (emptyNeighbors.length > 0) {
                var direction = randomInt(0, emptyNeighbors.length);
                var target = emptyNeighbors[direction];
                target.setOrganism(new Herbivore(this.energy - 10));
                target.skip();
                neighbors.myself.setOrganism(null);
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
        _this.energy = startingEnergy || parasiteParameters["defaultStartingEnergy"];
        _this.behavior = function (neighbors) {
            if (this.energy <= 0) {
                neighbors.myself.setOrganism(null);
                return;
            }
            var parasiteNeighbors = getNeighborsOfType(neighbors.arr, "parasite");
            var plantNeighbors = getNeighborsOfType(neighbors.getNonDiagonalArray(), "plant");
            if (parasiteNeighbors.length >= parasiteParameters["parasiteOverpopulation"] || plantNeighbors.length == 0) {
                this.energy -= parasiteParameters["energyLostToOverpopulation"];
                return;
            }
            else if (parasiteNeighbors.length < parasiteParameters["gainEnergyIfPopUnder"]) {
                this.energy += parasiteParameters["energyAddedPerTick"];
            }
            if (this.energy > parasiteParameters["energyToSplit"]) {
                if (plantNeighbors.length > 0) {
                    var direction = randomInt(0, plantNeighbors.length);
                    var target = plantNeighbors[direction];
                    target.setOrganism(new Parasite(target.organism.energy));
                    target.skip();
                    neighbors.myself.setOrganism(new Parasite());
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
        _this.energy = vineParameters["defaultStartingEnergy"];
        _this.behavior = function (neighbors) {
            var vineNeighbors = getNeighborsOfType(neighbors.arr, "vine");
            if (vineNeighbors.length < vineParameters["maxVineNeighborsToSplit"] && this.energy > vineParameters["energyToSplit"]) {
                this.energy = 0;
                if (vineNeighbors.length > 0) {
                    var direction = void 0;
                    var neighborArray = neighbors.arr;
                    for (var i = 0; i < neighborArray.length; i++) {
                        if (neighborArray[i] != null && neighborArray[i].organism != null && neighborArray[i].organism.name == "vine") {
                            direction = i + 3;
                        }
                    }
                    direction += randomInt(0, 3);
                    direction = direction % 8;
                    var target = neighborArray[direction];
                    if (target != null && target.organism != null && target.organism.name == "plant") {
                        target.setOrganism(new Vine());
                        target.skip();
                        neighbors.myself.setOrganism(new Vine());
                    }
                    return;
                }
                else {
                    var plantNeighbors = getNeighborsOfType(neighbors.arr, "plant");
                    if (plantNeighbors.length > 0) {
                        var direction = randomInt(0, plantNeighbors.length);
                        var target = plantNeighbors[direction];
                        target.setOrganism(new Vine());
                        target.skip();
                        neighbors.myself.setOrganism(new Vine());
                        return;
                    }
                }
            }
            else {
                this.energy += vineParameters["energyAddedPerTick"];
            }
        };
        return _this;
    }
    return Vine;
}(Organism));
/*
 *
 * Game of Life
 *
 */
function getLiveNeighbors(x, y, width, height, state) {
    var liveNeighbors = 0;
    if (y > 0 && state[x][y - 1] != "gameoflifedead")
        liveNeighbors++;
    if (y > 0 && x < width && state[x + 1][y - 1] != "gameoflifedead")
        liveNeighbors++;
    if (x < width && state[x + 1][y] != "gameoflifedead")
        liveNeighbors++;
    if (x < width && y < height && state[x + 1][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (y < height && state[x][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (y < height && x > 0 && state[x - 1][y + 1] != "gameoflifedead")
        liveNeighbors++;
    if (x > 0 && state[x - 1][y] != "gameoflifedead")
        liveNeighbors++;
    if (x > 0 && y > 0 && state[x - 1][y - 1] != "gameoflifedead")
        liveNeighbors++;
    return liveNeighbors;
}
var gameOfLiveAliveParameters = {
    minimumNeighborsToLive: 2,
    maximumNeighborsToLive: 3,
};
var GameOfLife = (function (_super) {
    __extends(GameOfLife, _super);
    function GameOfLife() {
        var _this = _super.call(this, "gameoflife", "black") || this;
        _this.behavior = function (neighbors, grid) {
            var x = neighbors.myself.x;
            var y = neighbors.myself.y;
            var state = grid.startState;
            var liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
            if (liveNeighbors < gameOfLiveAliveParameters["minimumNeighborsToLive"] || liveNeighbors > gameOfLiveAliveParameters["maximumNeighborsToLive"]) {
                neighbors.myself.setOrganism(new GameOfLifeDead());
            }
        };
        return _this;
    }
    return GameOfLife;
}(Organism));
var gameOfLiveDeadParameters = {
    numberOfNeighborsToLive: 3
};
var GameOfLifeDead = (function (_super) {
    __extends(GameOfLifeDead, _super);
    function GameOfLifeDead() {
        var _this = _super.call(this, "gameoflifedead", "lightgray") || this;
        _this.behavior = function (neighbors) {
            var x = neighbors.myself.x;
            var y = neighbors.myself.y;
            var state = grid.startState;
            var liveNeighbors = getLiveNeighbors(x, y, grid.width - 1, grid.height - 1, state);
            if (liveNeighbors == gameOfLiveDeadParameters["numberOfNeighborsToLive"]) {
                neighbors.myself.setOrganism(new GameOfLife());
            }
        };
        return _this;
    }
    return GameOfLifeDead;
}(Organism));
//# sourceMappingURL=organisms.js.map