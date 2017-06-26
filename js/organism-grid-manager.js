define(["require", "exports", "grid", "organisms", "helpers"], function (require, exports, grid_1, organisms_1, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const MAX_CELLS_PER_STEP = 10000;
    class OrganismGridManager {
        constructor(width, height, canvas, cellsPerStepMultiplier = 1) {
            this.grid = new grid_1.Grid(width, height, canvas);
            this.turnQueue = [];
            this.cellsPerStepMultiplier = cellsPerStepMultiplier;
        }
        step() {
            let cellsPerStep = Math.min(this.turnQueue.length * this.cellsPerStepMultiplier, MAX_CELLS_PER_STEP);
            let cellsProcessed = 0;
            if (this.turnQueue.length > 40000) {
                console.log(this.turnQueue.length);
            }
            while (cellsProcessed < cellsPerStep) {
                if (this.turnQueue.length > 0) {
                    let index = this.turnQueue.shift();
                    this.runCellBehavior(index);
                }
                else {
                    break;
                }
                cellsProcessed++;
            }
        }
        setCellOccupant(x, y, occupant) {
            this.grid.setOccupant(x, y, occupant);
            this.addToTurnQueue(occupant);
        }
        clearCell(x, y) {
            this.grid.clearCell(x, y);
        }
        getCell(x, y) {
            return this.grid.getCell(x, y);
        }
        getNeighbors(occupant, useDiagonals = false) {
            return this.getNeighborsOfCell(occupant.cell.x, occupant.cell.y, useDiagonals);
        }
        getNeighborsOfCell(x, y, useDiagonals = false) {
            let neighbors = [];
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
        }
        getNeighborsOfType(occupant, type, useDiagonals = false) {
            return this.getNeighborsOfTypes(occupant, [type], useDiagonals);
        }
        getNeighborsOfTypes(occupant, types, useDiagonals = false) {
            return this.getNeighbors(occupant, useDiagonals).filter(neighbor => {
                if (neighbor) {
                    return types.indexOf(neighbor.occupant.name) != -1;
                }
                else {
                    return false;
                }
            });
        }
        getDimensions() {
            return [this.grid.width, this.grid.height];
        }
        addToTurnQueue(occupant) {
            this.addCellsToTurnQueue([occupant.cell]);
        }
        addCellsToTurnQueue(cells) {
            cells.forEach(cell => {
                if (cell) {
                    this.turnQueue.push(cell.y * this.grid.width + cell.x);
                }
            });
        }
        runCellBehavior(index) {
            let x = index % this.grid.width;
            let y = Math.floor(index / this.grid.width);
            let organism = this.getCell(x, y).occupant;
            if (organism.behavior) {
                organism.behavior(this);
            }
        }
        /*
         * Common beaviors
         */
        move(organism, newX, newY) {
            let newOrganism = organism;
            this.kill(organism);
            return this.clone(newOrganism, newX, newY, organism.energy);
        }
        moveRandom(organism, availableCells) {
            let newOrganism = organism;
            this.kill(organism);
            return this.cloneRandom(newOrganism, availableCells);
        }
        clone(organism, newX, newY, startingEnergy) {
            let newCell = this.getCell(newX, newY);
            let newOrganism = organisms_1.getOrganism(organism.name, newCell);
            newOrganism.energy = startingEnergy || organism.energy;
            this.setCellOccupant(newX, newY, newOrganism);
            this.addToTurnQueue(organism);
            this.addCellsToTurnQueue(this.getNeighborsOfCell(newX, newY));
            return this.getCell(newX, newY);
        }
        cloneRandom(organism, availableCells) {
            if (!availableCells) {
                availableCells = this.getNeighborsOfType(organism, "empty");
            }
            if (availableCells.length > 0) {
                let index = helpers_1.randomInt(0, availableCells.length);
                let newX = availableCells[index].x;
                let newY = availableCells[index].y;
                return this.clone(organism, newX, newY);
            }
        }
        kill(organism) {
            this.clearCell(organism.cell.x, organism.cell.y);
        }
        setType(x, y, type) {
            let newCell = this.getCell(x, y);
            this.setCellOccupant(x, y, organisms_1.getOrganism(type, newCell));
        }
    }
    exports.OrganismGridManager = OrganismGridManager;
});
//# sourceMappingURL=organism-grid-manager.js.map