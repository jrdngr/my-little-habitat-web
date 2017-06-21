define(["require", "exports", "organism-grid-manager", "organisms"], function (require, exports, organism_grid_manager_1, organisms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GRID_WIDTH = 200;
    var GRID_HEIGHT = GRID_WIDTH;
    var mouseDown = false;
    var cellsPerStepMultiplier = 2;
    var selected = organisms_1.Organisms.Plant;
    init();
    function init() {
        var canvas = document.getElementById("canvas");
        canvas.height = window.innerHeight;
        canvas.width = canvas.height;
        var gridManager = new organism_grid_manager_1.OrganismGridManager(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);
        var xScale = canvas.width / gridManager.getDimensions()[0];
        var yScale = canvas.height / (gridManager.getDimensions()[1] - 1);
        var setCell = function (event) {
            var rect = canvas.getBoundingClientRect();
            var _a = getGridCoordinates(event, rect, xScale, yScale), x = _a[0], y = _a[1];
            var cell = gridManager.getCell(x, y);
            gridManager.setCellOccupant(x, y, organisms_1.getOrganism(selected, cell));
        };
        var setSelectedElement = function () {
            var selectedElement = document.getElementById("selected-organism");
            selectedElement.innerHTML = selected.toString();
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
                    selected = organisms_1.Organisms.Plant;
                    break;
                case 50:
                    selected = organisms_1.Organisms.Herbivore;
                    break;
                case 51:
                    selected = organisms_1.Organisms.Parasite;
                    break;
                default:
                    break;
            }
            setSelectedElement();
        };
        setSelectedElement();
        mainLoop(gridManager);
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