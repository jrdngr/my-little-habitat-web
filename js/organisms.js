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
            this.behavior = function (gridManager) {
                if (helpers_1.randomPercentage(1)) {
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
            this.behavior = function (gridManager) {
                if (helpers_1.randomPercentage(15)) {
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
            this.energy = startEnergy;
            this.behavior = function (gridManager) {
                let neighbors = gridManager.getNeighbors(this);
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                let plantNeighbors = gridManager.getNeighborsOfType(this, exports.PLANT);
                if (plantNeighbors.length > 0) {
                    if (this.energy <= 200) {
                        this.energy += 5;
                        let oldX = this.cell.x;
                        let oldY = this.cell.y;
                        gridManager.moveRandom(this, plantNeighbors);
                        gridManager.setType(oldX, oldY, exports.DEAD_PLANT);
                    }
                    else {
                        this.energy /= 2;
                        gridManager.cloneRandom(this, plantNeighbors);
                    }
                    gridManager.addCellsToTurnQueue(neighbors);
                }
                else {
                    this.energy -= 2;
                    if (helpers_1.randomPercentage(10)) {
                        gridManager.moveRandom(this, gridManager.getNeighborsOfTypes(this, ["empty", exports.HERBIVORE, exports.DEAD_PLANT], false));
                    }
                    else {
                        gridManager.addToTurnQueue(this);
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
            this.behavior = function (gridManager) {
                if (this.energy <= 0) {
                    gridManager.kill(this);
                    return;
                }
                let parasiteNeighbors = gridManager.getNeighborsOfType(this, exports.PARASITE, true);
                let plantNeighbors = gridManager.getNeighborsOfType(this, exports.PLANT, true);
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
        }
    }
    exports.Parasite = Parasite;
    class Vine extends Organism {
        constructor(cell, startEnergy = 0) {
            super(exports.VINE, "purple", cell);
            this.energy = startEnergy;
            this.behavior = function (gridManager) {
            };
        }
    }
    exports.Vine = Vine;
});
//# sourceMappingURL=organisms.js.map