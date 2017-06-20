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
    function Square(grid, organism, x, y, svgBox) {
        this.grid = grid;
        this.organism = organism;
        this.x = x;
        this.y = y;
        this.svgBox = svgBox;
        this.skipNext = false;
    }
    Square.prototype.clear = function () {
        this.organism = null;
    };
    Square.prototype.getColor = function () {
        return this.organism == null ? null : this.organism.color;
    };
    Square.prototype.setOrganism = function (organism) {
        var newColor = organism == null ? "white" : organism.color;
        this.organism = organism;
        this.svgBox.setAttribute("style", getBoxStyle(newColor, grid.drawBorders));
    };
    Square.prototype.skip = function () {
        this.skipNext = true;
    };
    return Square;
}());
var Grid = (function () {
    function Grid(svg, width, height, drawBorders) {
        this.svg = svg;
        this.width = width;
        this.height = height;
        this.drawBorders = drawBorders;
        this.squares = [];
        this.startState = [];
        this.createGrid();
    }
    Grid.prototype.createGrid = function () {
        var svgWidth = parseInt(this.svg.getAttribute("width")) - 1;
        var svgHeight = parseInt(this.svg.getAttribute("height")) - 1;
        var dx = svgWidth / this.width;
        var dy = svgHeight / this.height;
        for (var x = 0; x < this.width; x++) {
            this.squares[x] = [];
            this.startState[x] = [];
            for (var y = 0; y < this.height; y++) {
                var box = this.createBox(x, y, dx, dy, "white");
                this.squares[x][y] = new Square(this, null, x, y, box);
                this.startState[x][y] = null;
                this.svg.appendChild(box);
            }
        }
    };
    Grid.prototype.runBehaviors = function () {
        this.setStartState();
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var organism = this.squares[x][y].organism;
                if (!this.squares[x][y].skipNext && organism != null) {
                    organism.behavior(this.getNeighbors(x, y), this);
                }
                this.squares[x][y].skipNext = false;
            }
        }
    };
    Grid.prototype.setStartState = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var organism = this.squares[x][y].organism;
                if (organism == null) {
                    this.startState[x][y] = null;
                }
                else {
                    this.startState[x][y] = organism.name;
                }
            }
        }
    };
    Grid.prototype.setOrganism = function (x, y, organism) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.width) {
            return;
        }
        var currentSquare = this.squares[x][y];
        currentSquare.setOrganism(organism);
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
    Grid.prototype.createBox = function (xPos, yPos, width, height, color) {
        var box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        box.setAttribute("height", width);
        box.setAttribute("width", height);
        box.setAttribute("style", getBoxStyle(color, this.drawBorders));
        box.setAttribute("x", (width * xPos).toString());
        box.setAttribute("y", (height * yPos).toString());
        box.setAttribute("onclick", "squareClicked(" + xPos + "," + yPos + " )");
        box.addEventListener("mouseover", function (e) { mousedOver(xPos, yPos); });
        return box;
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