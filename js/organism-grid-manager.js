define(["require", "exports", "grid", "organisms", "helpers"], function (require, exports, grid_1, organisms_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_CELLS_PER_STEP = 10000;
    var OrganismGridManager = (function () {
        function OrganismGridManager(width, height, canvas, cellsPerStepMultiplier) {
            if (cellsPerStepMultiplier === void 0) { cellsPerStepMultiplier = 1; }
            this.grid = new grid_1.Grid(width, height, canvas);
            this.turnQueue = [];
            this.cellsPerStepMultiplier = cellsPerStepMultiplier;
        }
        OrganismGridManager.prototype.step = function () {
            var cellsPerStep = Math.min(this.turnQueue.length * this.cellsPerStepMultiplier, MAX_CELLS_PER_STEP);
            var cellsProcessed = 0;
            while (cellsProcessed < cellsPerStep) {
                if (this.turnQueue.length > 0) {
                    var index = this.turnQueue.shift();
                    this.runCellBehavior(index);
                }
                else {
                    break;
                }
                cellsProcessed++;
            }
        };
        OrganismGridManager.prototype.setCellOccupant = function (x, y, occupant) {
            this.grid.setOccupant(x, y, occupant);
            this.addToTurnQueue(occupant);
        };
        OrganismGridManager.prototype.clearCell = function (x, y) {
            this.grid.clearCell(x, y);
        };
        OrganismGridManager.prototype.getCell = function (x, y) {
            return this.grid.getCell(x, y);
        };
        OrganismGridManager.prototype.getNeighborhood = function (occupant, useDiagonals) {
            if (useDiagonals === void 0) { useDiagonals = false; }
            return this.getNeighborhoodOfCell(occupant.cell.x, occupant.cell.y, useDiagonals);
        };
        OrganismGridManager.prototype.getNeighborhoodOfCell = function (x, y, useDiagonals) {
            if (useDiagonals === void 0) { useDiagonals = false; }
            var neighbors = [];
            neighbors.push(this.grid.getCell(x, y));
            neighbors.push(this.grid.getCell(x, y - 1));
            neighbors.push(this.grid.getCell(x + 1, y));
            neighbors.push(this.grid.getCell(x, y + 1));
            neighbors.push(this.grid.getCell(x - 1, y));
            if (useDiagonals) {
                neighbors.push(this.grid.getCell(x + 1, y - 1));
                neighbors.push(this.grid.getCell(x + 1, y + 1));
                neighbors.push(this.grid.getCell(x - 1, y + 1));
                neighbors.push(this.grid.getCell(x - 1, y - 1));
            }
            return neighbors;
        };
        OrganismGridManager.prototype.getNeighborhoodOfType = function (occupant, type, useDiagonals) {
            if (useDiagonals === void 0) { useDiagonals = false; }
            return this.getNeighborhood(occupant, useDiagonals).filter(function (neighbor) {
                if (neighbor) {
                    return neighbor.occupant.name == type;
                }
                else {
                    return false;
                }
            });
        };
        OrganismGridManager.prototype.getDimensions = function () {
            return [this.grid.width, this.grid.height];
        };
        OrganismGridManager.prototype.addToTurnQueue = function (occupant) {
            if (occupant && occupant.cell) {
                this.turnQueue.push(occupant.cell.y * this.grid.width + occupant.cell.x);
            }
        };
        OrganismGridManager.prototype.runCellBehavior = function (index) {
            var x = index % this.grid.width;
            var y = Math.floor(index / this.grid.width);
            var organism = this.getCell(x, y).occupant;
            if (organism.behavior) {
                organism.behavior(this);
            }
        };
        /*
         * Common beaviors
         */
        OrganismGridManager.prototype.move = function (organism, newX, newY) {
            this.clone(organism, newX, newY, organism.energy);
            this.kill(organism);
        };
        OrganismGridManager.prototype.moveRandom = function (organism, availableCells) {
            if (!availableCells) {
                availableCells = this.getNeighborhoodOfType(organism, "empty");
            }
            if (availableCells.length > 0) {
                this.cloneRandom(organism, availableCells);
                this.kill(organism);
            }
        };
        OrganismGridManager.prototype.clone = function (organism, newX, newY, startingEnergy) {
            var newCell = this.getCell(newX, newY);
            var newOrganism = organisms_1.getOrganism(organism.name, newCell);
            newOrganism.energy = startingEnergy || organism.energy;
            this.setCellOccupant(newX, newY, newOrganism);
            this.addToTurnQueue(organism);
        };
        OrganismGridManager.prototype.cloneRandom = function (organism, availableCells) {
            if (!availableCells) {
                availableCells = this.getNeighborhoodOfType(organism, "empty");
            }
            if (availableCells.length > 0) {
                var index = helpers_1.randomInt(0, availableCells.length);
                var newX = availableCells[index].x;
                var newY = availableCells[index].y;
                this.clone(organism, newX, newY);
            }
        };
        OrganismGridManager.prototype.kill = function (organism) {
            this.clearCell(organism.cell.x, organism.cell.y);
        };
        return OrganismGridManager;
    }());
    exports.OrganismGridManager = OrganismGridManager;
});
//# sourceMappingURL=organism-grid-manager.js.map