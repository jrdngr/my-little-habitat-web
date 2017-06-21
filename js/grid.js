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
        function Grid(width, height, canvas) {
            this.width = width;
            this.height = height;
            this.canvas = canvas;
            this.context = canvas.getContext("2d");
            this.cells = [];
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
                this.drawCell(x, y);
            }
        };
        Grid.prototype.clearCell = function (x, y) {
            var index = this.getIndex(x, y);
            if (index != null) {
                var cell = this.cells[index];
                cell.occupant = new Empty(cell);
                this.drawCell(x, y);
            }
        };
        Grid.prototype.drawCell = function (x, y) {
            var rectX = Math.floor((x * this.cellWidth) - CELL_OVERLAP);
            var rectY = Math.floor((y * this.cellHeight) - CELL_OVERLAP);
            var rectWidth = Math.floor(this.cellWidth + CELL_OVERLAP);
            var rectHeight = Math.floor(this.cellHeight + CELL_OVERLAP);
            this.context.fillStyle = this.getCell(x, y).occupant.color;
            this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
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
        return Grid;
    }());
    exports.Grid = Grid;
    var Cell = (function () {
        function Cell(x, y) {
            this.x = x;
            this.y = y;
            this.occupant = new Empty(this);
        }
        return Cell;
    }());
    exports.Cell = Cell;
    var Occupant = (function () {
        function Occupant(name, color, cell) {
            this.name = name;
            this.color = color;
            this.cell = cell;
        }
        return Occupant;
    }());
    exports.Occupant = Occupant;
    var Empty = (function (_super) {
        __extends(Empty, _super);
        function Empty(cell) {
            return _super.call(this, "empty", "black", cell) || this;
        }
        return Empty;
    }(Occupant));
});
//# sourceMappingURL=grid.js.map