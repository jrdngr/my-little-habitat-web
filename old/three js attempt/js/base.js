var Occupant = (function () {
    function Occupant(name, color, behavior) {
        this.name = name;
        this.color = color;
        this.behavior = behavior;
    }
    return Occupant;
}());
var Direction;
(function (Direction) {
    Direction[Direction["N"] = 0] = "N";
    Direction[Direction["NE"] = 1] = "NE";
    Direction[Direction["E"] = 2] = "E";
    Direction[Direction["SE"] = 3] = "SE";
    Direction[Direction["S"] = 4] = "S";
    Direction[Direction["SW"] = 5] = "SW";
    Direction[Direction["W"] = 6] = "W";
    Direction[Direction["NW"] = 7] = "NW";
})(Direction || (Direction = {}));
var Neighbors = (function () {
    function Neighbors(myself, n, ne, e, se, s, sw, w, nw) {
        this.myself = myself;
        this.arr = [n, ne, e, se, s, sw, w, nw];
    }
    Neighbors.prototype.getNonDiagonalArray = function () {
        return [this.arr[0], this.arr[2], this.arr[4], this.arr[6]];
    };
    return Neighbors;
}());
var Square = (function () {
    function Square(grid, occupant, x, y, rendererCell) {
        this.grid = grid;
        this.occupant = occupant;
        this.x = x;
        this.y = y;
        this.rendererCell = rendererCell;
        this.skipNext = false;
    }
    Square.prototype.clear = function () {
        this.occupant = null;
    };
    Square.prototype.getColor = function () {
        return this.occupant == null ? null : this.occupant.color;
    };
    Square.prototype.setOccupant = function (occupant) {
        var newColor = occupant == null ? "white" : occupant.color;
        this.occupant = occupant;
    };
    Square.prototype.skip = function () {
        this.skipNext = true;
    };
    return Square;
}());
var Grid = (function () {
    function Grid(renderer, width, height, drawBorders) {
        this.renderer = renderer;
        this.width = width;
        this.height = height;
        this.drawBorders = drawBorders;
        this.squares = [];
        this.createGrid();
    }
    Grid.prototype.getSquare = function (x, y) {
        return this.squares[x * this.width + y];
    };
    Grid.prototype.getX = function (i) {
        return i % this.width;
    };
    Grid.prototype.getY = function (i) {
        return Math.floor(i / this.height);
    };
    Grid.prototype.createGrid = function () {
        var startX = this.renderer.camera.left + (this.width / 2);
        var startY = this.renderer.camera.bottom + (this.height / 2);
        var dx = Math.floor(this.renderer.width / this.width);
        var dy = Math.floor(this.renderer.height / this.height);
        for (var i = 0; i < this.width * this.height; i++) {
            var x = this.getX(i);
            var y = this.getY(i);
            var color = (i % 2 == 0) ? "black" : "grey";
            var square = this.renderer.createGridCell(startX + x * dx, startY + y * dy, color);
            this.squares[i] = new Square(this, null, x, y, square);
        }
    };
    Grid.prototype.runBehaviors = function () {
        for (var i = 0; i < this.squares.length; i++) {
            var organism = this.squares[i].occupant;
            if (!this.squares[i].skipNext && organism != null) {
                var x = this.getX(i);
                var y = this.getY(i);
                organism.behavior(this.getNeighbors(x, y), this);
            }
        }
    };
    Grid.prototype.setOrganism = function (x, y, organism) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.width) {
            return;
        }
        var currentSquare = this.squares[x][y];
        currentSquare.setOccupant(organism);
    };
    Grid.prototype.getNeighbors = function (x, y) {
        var xMax = this.width - 1;
        var yMax = this.height - 1;
        if (x > xMax || x < 0 || y > yMax || y < 0) {
            console.log("(" + x + "," + y + ") is out of bounds");
            return null;
        }
        return new Neighbors(this.squares[x][y], y > 0 ? this.squares[x][y - 1] : null, x < xMax && y > 0 ? this.squares[x + 1][y - 1] : null, x < xMax ? this.squares[x + 1][y] : null, x < xMax && y < yMax ? this.squares[x + 1][y + 1] : null, y < yMax ? this.squares[x][y + 1] : null, x > 0 && y < yMax ? this.squares[x - 1][y + 1] : null, x > 0 ? this.squares[x - 1][y] : null, x > 0 && y > 0 ? this.squares[x - 1][y - 1] : null);
    };
    Grid.prototype.resetGrid = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.setOrganism(x, y, null);
            }
        }
    };
    return Grid;
}());
function getBoxStyle(color, drawBorders) {
    var borderColor = color;
    if (drawBorders) {
        borderColor = "black";
    }
    return "fill:" + color + ";stroke:" + borderColor + ";stroke-width:1";
    ;
}
//# sourceMappingURL=base.js.map