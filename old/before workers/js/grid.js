define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const CELL_OVERLAP = 1;
    class Grid {
        constructor(width, height, canvas) {
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
        createGrid() {
            for (let i = 0; i < this.width * this.height; i++) {
                this.cells.push(new Cell(i % this.width, Math.floor(i / this.width)));
            }
        }
        getCell(x, y) {
            return this.cells[this.getIndex(x, y)];
        }
        getIndex(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                return null;
            }
            else {
                return y * this.width + x;
            }
        }
        setOccupant(x, y, occupant) {
            let index = this.getIndex(x, y);
            if (index != null) {
                this.cells[index].occupant = occupant;
                this.drawCell(x, y);
            }
        }
        clearCell(x, y) {
            let index = this.getIndex(x, y);
            if (index != null) {
                let cell = this.cells[index];
                cell.occupant = new Empty(cell);
                this.drawCell(x, y);
            }
        }
        drawCell(x, y) {
            let rectX = Math.floor((x * this.cellWidth) - CELL_OVERLAP);
            let rectY = Math.floor((y * this.cellHeight) - CELL_OVERLAP);
            let rectWidth = Math.floor(this.cellWidth + CELL_OVERLAP);
            let rectHeight = Math.floor(this.cellHeight + CELL_OVERLAP);
            this.context.fillStyle = this.getCell(x, y).occupant.color;
            this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
        }
        drawFullGrid() {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.drawCell(x, y);
                }
            }
        }
        drawGridLines(color) {
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    this.context.strokeStyle = color;
                    this.context.beginPath();
                    this.context.moveTo(x * this.cellWidth, 0);
                    this.context.lineTo(x * this.cellWidth, this.canvas.height);
                    this.context.moveTo(0, y * this.cellHeight);
                    this.context.lineTo(this.canvas.width, y * this.cellHeight);
                    this.context.stroke();
                }
            }
        }
    }
    exports.Grid = Grid;
    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.occupant = new Empty(this);
        }
    }
    exports.Cell = Cell;
    class Occupant {
        constructor(name, color, cell) {
            this.name = name;
            this.color = color;
            this.cell = cell;
        }
    }
    exports.Occupant = Occupant;
    class Empty extends Occupant {
        constructor(cell) {
            super("empty", "black", cell);
        }
    }
    exports.Empty = Empty;
});
//# sourceMappingURL=grid.js.map