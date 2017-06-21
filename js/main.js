define(["require", "exports", "organism-grid-manager", "organisms"], function (require, exports, organism_grid_manager_1, organisms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GRID_WIDTH = 200;
    var GRID_HEIGHT = GRID_WIDTH;
    var mouseDown = false;
    var cellsPerStepMultiplier = 2;
    var selected = "plant";
    var selections = [];
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
        createControls();
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
    function createControls() {
        selections.push(document.getElementById('organism-plant'));
        selections.push(document.getElementById('organism-herbivore'));
        selections.push(document.getElementById('organism-parasite'));
        selections.forEach(function (selection) { return selection.onclick = selectionChanged; });
    }
    function selectionChanged() {
        selections.forEach(function (selection) {
            if (selection.checked) {
                selected = selection.value;
            }
        });
    }
});
//# sourceMappingURL=main.js.map