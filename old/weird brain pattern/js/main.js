define(["require", "exports", "grid", "organisms"], function (require, exports, grid_1, Organisms) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GRID_WIDTH = 200;
    var GRID_HEIGHT = GRID_WIDTH;
    var mouseDown = false;
    var cellsPerStepMultiplier = 10;
    var selected = "plant";
    init();
    function init() {
        var canvas = document.getElementById("canvas");
        canvas.height = window.innerHeight;
        canvas.width = canvas.height;
        var grid = new grid_1.Grid(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);
        var xScale = canvas.width / grid.width;
        var yScale = canvas.height / (grid.height - 1);
        var setCell = function (event) {
            var rect = canvas.getBoundingClientRect();
            var _a = getGridCoordinates(event, rect, xScale, yScale), x = _a[0], y = _a[1];
            grid.setOccupant(x, y, Organisms.getOrganism(selected));
        };
        canvas.addEventListener('mousemove', function (event) {
            if (mouseDown) {
                setCell(event);
            }
        });
        canvas.addEventListener('mousedown', function (event) {
            mouseDown = true;
            setCell(event);
        });
        canvas.addEventListener('mouseup', function () { mouseDown = false; });
        canvas.addEventListener('mouseleave', function () { mouseDown = false; });
        document.onkeypress = function (event) {
            switch (event.keyCode) {
                case 49:
                    selected = "plant";
                    break;
                case 50:
                    selected = "herbivore";
                    break;
                default:
                    break;
            }
            console.log(selected);
        };
        mainLoop(grid);
    }
    function mainLoop(grid) {
        grid.step();
        var animationFrame = window.requestAnimationFrame(mainLoop.bind(this, grid));
    }
    function getGridCoordinates(event, rect, xScale, yScale) {
        var x = Math.floor((event.clientX - rect.left) / xScale);
        var y = Math.floor((event.clientY - rect.top) / yScale);
        return [x, y];
    }
});
//# sourceMappingURL=main.js.map