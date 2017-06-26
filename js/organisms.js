define(["require", "exports", "grid", "helpers"], function (require, exports, grid_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PLANT = "plant";
    exports.DEAD_PLANT = "dead-plant";
    exports.HERBIVORE = "herbivore";
    exports.PARASITE = "parasite";
    exports.VINE = "vine";
    exports.WALL = "wall";
    exports.EMPTY = "empty";
    exports.getOrganism = function (type, cell) {
        switch (type) {
            case exports.WALL:
                return new Wall(cell);
            case exports.PLANT:
                return new Plant(cell);
            case exports.HERBIVORE:
                return new Herbivore(cell);
            case exports.PARASITE:
                return new Parasite(cell);
            case exports.DEAD_PLANT:
                return new DeadPlant(cell);
            case exports.VINE:
                return new Vine(cell);
            case exports.EMPTY:
                return (new grid_1.Empty(cell));
            default:
                throw "Invalid type";
        }
    };
    class Organism extends grid_1.Occupant {
        constructor(name, color, cell, behavior) {
            super(name, color, cell);
            this.parameters = new Map();
            this.behavior = behavior || function () { };
        }
    }
    exports.Organism = Organism;
    class Wall extends Organism {
        constructor(cell) {
            super(exports.WALL, "lightgray", cell);
        }
    }
    exports.Wall = Wall;
    class Plant extends Organism {
        constructor(cell, startEnergy = 0) {
            super(exports.PLANT, "green", cell);
            this.energy = startEnergy;
            this.parameters.set("chanceToSplit", 1);
            this.behavior = function (gridManager) {
                if (helpers_1.randomPercentage(this.parameters.get("chanceToSplit"))) {
                    gridManager.cloneRandom(this);
                }
                else {
                    gridManager.addToTurnQueue(this);
                }
            };
        }
    }
    exports.Plant = Plant;
    class DeadPlant extends Organism {
        constructor(cell, startEnergy = 100) {
            super(exports.DEAD_PLANT, "darkgreen", cell);
            this.energy = startEnergy;
            this.parameters.set("chanceToLoseEnergy", 5);
            this.behavior = function (gridManager) {
                if (helpers_1.randomPercentage(this.parameters.get("chanceToLoseEnergy"))) {
                    this.energy--;
                }
                if (this.energy <= 0) {
                    gridManager.addCellsToTurnQueue(gridManager.getNeighbors(this));
                    gridManager.kill(this);
                    return;
                }
                gridManager.addToTurnQueue(this);
            };
        }
    }
    exports.DeadPlant = DeadPlant;
    class Herbivore extends Organism {
        constructor(cell, startEnergy = 50) {
            super(exports.HERBIVORE, "blue", cell);
            this.wait = 0;
            this.energy = startEnergy;
            this.parameters.set("energyToSplit", 200);
            this.parameters.set("energyPerPlant", 5);
            this.parameters.set("moveCost", 10);
            this.parameters.set("waitAfterMove", 10);
            this.parameters.set("waitAfterClone", 50);
            this.behavior = function (gridManager) {
                let neighbors = gridManager.getNeighbors(this);
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                let plantNeighbors = gridManager.getNeighborsOfType(this, exports.PLANT);
                if (this.wait <= 0 && plantNeighbors.length > 0) {
                    if (this.energy <= this.parameters.get("energyToSplit")) {
                        this.energy += this.parameters.get("energyPerPlant");
                        let oldX = this.cell.x;
                        let oldY = this.cell.y;
                        let clone = gridManager.moveRandom(this, plantNeighbors);
                        clone.occupant.wait = this.parameters.get("waitAfterMove");
                        gridManager.setType(oldX, oldY, exports.DEAD_PLANT);
                    }
                    else {
                        this.energy /= 2;
                        let clone = gridManager.cloneRandom(this, plantNeighbors);
                        clone.occupant.wait = this.parameters.get("waitAfterClone");
                    }
                    gridManager.addCellsToTurnQueue(neighbors);
                }
                else {
                    if (this.wait > 0) {
                        this.wait--;
                        gridManager.addToTurnQueue(this);
                    }
                    else {
                        this.energy -= this.parameters.get("moveCost");
                        let newPos = gridManager.moveRandom(this, gridManager.getNeighborsOfTypes(this, ["empty", exports.HERBIVORE, exports.DEAD_PLANT], false));
                        if (newPos && newPos.occupant) {
                            newPos.occupant.wait = this.parameters.get("waitAfterMove");
                        }
                    }
                }
            };
        }
    }
    exports.Herbivore = Herbivore;
    class Parasite extends Organism {
        constructor(cell, startEnergy = 10) {
            super(exports.PARASITE, "red", cell);
            this.energy = startEnergy;
            this.parameters.set("overpopulation", 5);
            this.parameters.set("energyToSplit", 350);
            this.behavior = function (gridManager) {
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                let parasiteNeighbors = gridManager.getNeighborsOfType(this, exports.PARASITE, true);
                let plantNeighbors = gridManager.getNeighborsOfType(this, exports.PLANT, true);
                if (parasiteNeighbors.length >= this.parameters.get("overpopulation") || plantNeighbors.length == 0) {
                    this.energy--;
                    gridManager.addToTurnQueue(this);
                }
                else {
                    this.energy++;
                    gridManager.addToTurnQueue(this);
                }
                if (this.energy > this.parameters.get("energyToSplit")) {
                    if (plantNeighbors.length > 0) {
                        this.energy = 1;
                        gridManager.cloneRandom(this, plantNeighbors);
                        gridManager.addCellsToTurnQueue(plantNeighbors);
                    }
                }
            };
        }
    }
    exports.Parasite = Parasite;
    class Vine extends Organism {
        constructor(cell) {
            super(exports.VINE, "purple", cell);
            this.energy = 0;
            this.behavior = function (gridManager) {
                let vineNeighbors = gridManager.getNeighborsOfType(this, exports.VINE);
                if (vineNeighbors.length < 3) {
                    let neighbors = gridManager.getNeighbors(this, true);
                    let ordering = helpers_1.randomOrdering(helpers_1.integerSequence(0, 8));
                    let direction = helpers_1.randomInt(0, 8);
                    for (let i = 0; i < ordering.length; i++) {
                        let index = ordering[i];
                        let check = neighbors[index];
                        if (check && check.occupant && check.occupant.name == exports.VINE) {
                            direction = index + 3 + helpers_1.randomInt(0, 3);
                        }
                    }
                    let target = neighbors[direction];
                    if (target) {
                        gridManager.clone(this, target.x, target.y);
                    }
                }
                vineNeighbors = gridManager.getNeighborsOfType(this, exports.VINE);
                if (vineNeighbors.length < 3) {
                    gridManager.addToTurnQueue(this);
                }
            };
        }
    }
    exports.Vine = Vine;
});
//# sourceMappingURL=organisms.js.map