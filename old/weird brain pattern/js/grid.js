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
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CELL_OVERLAP = 1;
    var Grid = (function () {
        function Grid(width, height, canvas, cellsPerStepMultiplier) {
            if (cellsPerStepMultiplier === void 0) { cellsPerStepMultiplier = 10; }
            this.width = width;
            this.height = height;
            this.canvas = canvas;
            this.cellsPerStepMultiplier = cellsPerStepMultiplier;
            this.context = canvas.getContext("2d");
            this.cells = [];
            this.turnQueue = [];
            this.cellWidth = this.canvas.width / width;
            this.cellHeight = this.canvas.height / height;
            this.createGrid();
            this.drawFullGrid();
        }
        Grid.prototype.createGrid = function () {
            for (var i = 0; i < this.width * this.height; i++) {
                this.cells.push(new Cell(i % this.width, Math.floor(i / this.width)));
            }
        };
        Grid.prototype.getCell = function (x, y) {
            return this.cells[this.getIndex(x, y)];
        };
        Grid.prototype.getIndex = function (x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return null;
            }
            else {
                return y * this.width + x;
            }
        };
        Grid.prototype.setOccupant = function (x, y, occupant) {
            var index = this.getIndex(x, y);
            if (index != null) {
                this.cells[index].occupant = occupant;
                this.turnQueue.push(index);
                this.drawCell(x, y);
                this.addToTurnQueue(this.cells[index]);
            }
        };
        Grid.prototype.clearCell = function (x, y) {
            var index = this.getIndex(x, y);
            if (index != null) {
                this.cells[index].occupant = new Empty();
                this.drawCell(x, y);
            }
        };
        Grid.prototype.step = function () {
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
        Grid.prototype.drawCell = function (x, y) {
            this.context.fillStyle = this.getCell(x, y).occupant.color;
            this.context.fillRect((x * this.cellWidth) - CELL_OVERLAP, (y * this.cellHeight) - CELL_OVERLAP, this.cellWidth + CELL_OVERLAP, this.cellHeight + CELL_OVERLAP);
        };
        Grid.prototype.drawFullGrid = function () {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.drawCell(x, y);
                }
            }
        };
        Grid.prototype.drawGridLines = function (color) {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    this.context.strokeStyle = color;
                    this.context.beginPath();
                    this.context.moveTo(x * this.cellWidth, 0);
                    this.context.lineTo(x * this.cellWidth, this.canvas.height);
                    this.context.moveTo(0, y * this.cellHeight);
                    this.context.lineTo(this.canvas.width, y * this.cellHeight);
                    this.context.stroke();
                }
            }
        };
        Grid.prototype.getNeighbors = function (x, y, type, radius) {
            if (radius === void 0) { radius = 0; }
            var neighbors = [];
            neighbors.push(this.getCell(x, y));
            neighbors.push(this.getCell(x, y - 1));
            neighbors.push(this.getCell(x + 1, y));
            neighbors.push(this.getCell(x, y + 1));
            neighbors.push(this.getCell(x - 1, y));
            if (radius > 0) {
                neighbors.push(this.getCell(x + 1, y - 1));
                neighbors.push(this.getCell(x + 1, y + 1));
                neighbors.push(this.getCell(x - 1, y + 1));
                neighbors.push(this.getCell(x - 1, y - 1));
            }
            return neighbors;
        };
        Grid.prototype.addToTurnQueue = function (cell) {
            if (cell) {
                this.turnQueue.push(cell.y * this.width + cell.x);
            }
        };
        Grid.prototype.runCellBehavior = function (index) {
            var x = index % this.width;
            var y = Math.floor(index / this.width);
            this.cells[index].occupant.behavior(this.getNeighbors(x, y), this);
        };
        Grid.prototype.runAllBehaviors = function () {
            console.log("reset");
            this.turnQueue = [];
            for (var i = 0; i < this.cells.length; i++) {
                this.runCellBehavior(i);
            }
        };
        return Grid;
    }());
    exports.Grid = Grid;
    var Cell = (function () {
        function Cell(x, y) {
            this.x = x;
            this.y = y;
            this.occupant = new Empty();
        }
        return Cell;
    }());
    exports.Cell = Cell;
    var Occupant = (function () {
        function Occupant(name, color, behavior, neighborhoodRadius) {
            if (neighborhoodRadius === void 0) { neighborhoodRadius = 1; }
            this.name = name;
            this.color = color;
            this.behavior = behavior || function () { };
            this.neighborhoodRadius = neighborhoodRadius;
        }
        return Occupant;
    }());
    exports.Occupant = Occupant;
    var Empty = (function (_super) {
        __extends(Empty, _super);
        function Empty() {
            return _super.call(this, "empty", "black") || this;
        }
        return Empty;
    }(Occupant));
});
//# sourceMappingURL=grid.js.map