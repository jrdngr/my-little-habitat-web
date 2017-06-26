define(["require", "exports", "organism-grid-manager", "organisms"], function (require, exports, organism_grid_manager_1, organisms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const GRID_WIDTH = 200;
    const GRID_HEIGHT = GRID_WIDTH;
    let mouseDown = false;
    let cellsPerStepMultiplier = 5;
    let selected = "plant";
    let selections = [];
    let brushSizeElement;
    let brushSize;
    init();
    function init() {
        const canvas = document.getElementById("canvas");
        canvas.height = window.innerHeight;
        canvas.width = canvas.height;
        const gridManager = new organism_grid_manager_1.OrganismGridManager(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);
        const xScale = canvas.width / gridManager.getDimensions()[0];
        const yScale = canvas.height / (gridManager.getDimensions()[1] - 1);
        let setCell = function (event) {
            let rect = canvas.getBoundingClientRect();
            let [x, y] = getGridCoordinates(event, rect, xScale, yScale);
            for (let i = 0; i < brushSize; i++) {
                for (let j = 0; j < brushSize; j++) {
                    let cell = gridManager.getCell(x + i, y + j);
                    gridManager.setCellOccupant(x + i, y + j, organisms_1.getOrganism(selected, cell));
                }
            }
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
        brushSizeChanged();
        mainLoop(gridManager);
    }
    function mainLoop(grid) {
        grid.step();
        let animationFrame = window.requestAnimationFrame(mainLoop.bind(this, grid));
    }
    function getGridCoordinates(event, rect, xScale, yScale) {
        let x = Math.floor((event.clientX - rect.left) / xScale);
        let y = Math.floor((event.clientY - rect.top) / yScale);
        return [x, y];
    }
    function createControls() {
        selections.push(document.getElementById('organism-plant'));
        selections.push(document.getElementById('organism-herbivore'));
        selections.push(document.getElementById('organism-parasite'));
        //selections.push(<HTMLInputElement>document.getElementById('organism-vine'));
        selections.push(document.getElementById('organism-wall'));
        selections.push(document.getElementById('organism-empty'));
        selections.forEach(selection => selection.onclick = selectionChanged);
        brushSizeElement = document.getElementById('brush-size');
        brushSizeElement.onchange = brushSizeChanged;
    }
    function selectionChanged() {
        selections.forEach(selection => {
            if (selection.checked) {
                selected = selection.value;
            }
        });
    }
    function brushSizeChanged() {
        brushSize = parseInt(brushSizeElement.value);
    }
});
//# sourceMappingURL=main.js.map