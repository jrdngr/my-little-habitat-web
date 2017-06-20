define(["require", "exports", "grid"], function (require, exports, grid_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OrganismGridManager = (function () {
        function OrganismGridManager(width, height, canvas, cellsPerStepMultiplier) {
            if (cellsPerStepMultiplier === void 0) { cellsPerStepMultiplier = 1; }
            this.grid = new grid_1.Grid(width, height, canvas);
            this.turnQueue = [];
            this.cellsPerStepMultiplier = cellsPerStepMultiplier;
        }
        OrganismGridManager.prototype.step = function () {
            var cellsPerStep = this.turnQueue.length * this.cellsPerStepMultiplier;
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
        };
        OrganismGridManager.prototype.getCell = function (x, y) {
            return this.grid.getCell(x, y);
        };
        OrganismGridManager.prototype.getNeighborhood = function (x, y) {
            var neighbors = [];
            neighbors.push(this.grid.getCell(x, y));
            neighbors.push(this.grid.getCell(x, y - 1));
            neighbors.push(this.grid.getCell(x + 1, y));
            neighbors.push(this.grid.getCell(x, y + 1));
            neighbors.push(this.grid.getCell(x - 1, y));
            neighbors.push(this.grid.getCell(x + 1, y - 1));
            neighbors.push(this.grid.getCell(x + 1, y + 1));
            neighbors.push(this.grid.getCell(x - 1, y + 1));
            neighbors.push(this.grid.getCell(x - 1, y - 1));
            return neighbors;
        };
        OrganismGridManager.prototype.addToTurnQueue = function (cell) {
            if (cell) {
                this.turnQueue.push(cell.y * this.grid.width + cell.x);
            }
        };
        OrganismGridManager.prototype.runCellBehavior = function (index) {
            var x = index % this.grid.width;
            var y = Math.floor(index / this.grid.width);
            var organism = this.getCell(x, y).occupant;
            organism.behavior(this);
        };
        return OrganismGridManager;
    }());
    exports.OrganismGridManager = OrganismGridManager;
});
//# sourceMappingURL=turn-queue-grid-manager.js.map