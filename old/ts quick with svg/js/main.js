var svg;
var grid;
var running = true;
var lastFrame = Date.now();
var mspf = 50;
var gridSize = 100;
var showGrid = false;
var mouseDown = false;
var brushSize = 1;
function init() {
    document.body.onmousedown = function () { mouseDown = true; };
    document.body.onmouseup = function () { mouseDown = false; };
    document.body.onmouseleave = function () { mouseDown = false; };
    loadStoredValues();
    selectionChanged();
    svg = document.getElementById("canvas");
    grid = new Grid(svg, gridSize, gridSize, showGrid);
    mainLoop();
}
function mainLoop() {
    if (running) {
        if (Date.now() - lastFrame > mspf) {
            lastFrame = Date.now();
            grid.runBehaviors();
        }
        var animationFrame = window.requestAnimationFrame(this.mainLoop.bind(this));
    }
}
function loadStoredValues() {
    var storedMspf = localStorage.getItem("mspf");
    if (storedMspf != null) {
        mspf = parseInt(storedMspf);
        document.getElementById("mspf").value = mspf.toString();
    }
    var storedSelection = localStorage.getItem("selection");
    if (storedSelection != null) {
        var options = document.getElementsByName("organism");
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value == storedSelection) {
                option.checked = true;
                return;
            }
        }
    }
    var storedGridSize = localStorage.getItem("gridSize");
    if (storedGridSize != null) {
        gridSize = parseInt(storedGridSize);
        document.getElementById("grid-size").value = gridSize.toString();
    }
}
function getSelected() {
    var options = document.getElementsByName("organism");
    var selected = null;
    for (var i = 0; i < options.length; i++) {
        var option = options[i];
        if (option.checked) {
            selected = option.value;
            localStorage.setItem("selection", option.value);
        }
    }
    return selected;
}
function selectionChanged() {
    document.getElementById("brush-size").value = "1";
    brushSize = 1;
    var propertyDiv = document.getElementsByClassName("property-list")[0];
    var selected = getSelected();
    var selectedProperties = getPropertiesFromName(selected);
    var selectedName = "";
    switch (selected) {
        case "plant":
            selectedName = "Plant";
            break;
        case "herbivore":
            selectedName = "Herbivore";
            break;
        case "parasite":
            selectedName = "Parasite";
            break;
        case "vine":
            selectedName = "Vine";
            break;
        case "gola":
            selectedName = "Game of Life (alive)";
            break;
        case "gold":
            selectedName = "Game of Life (dead)";
            break;
        default:
            break;
    }
    document.getElementsByClassName("properties-title")[0].textContent = selectedName + " Properties";
    propertyDiv.innerHTML = "";
    Object.keys(selectedProperties).forEach(function (key) {
        var propertyName = document.createTextNode(key);
        var propertyBox = document.createElement("input");
        propertyBox.setAttribute("type", "number");
        propertyBox.setAttribute("name", key);
        propertyBox.setAttribute("value", selectedProperties[key]);
        propertyBox.setAttribute("onchange", "updateProperty(\"" + selected + "\", \"" + key + "\")");
        propertyDiv.appendChild(propertyBox);
        propertyDiv.appendChild(propertyName);
        propertyDiv.innerHTML += "<br>";
    });
}
function getPropertiesFromName(name) {
    switch (name) {
        case "plant":
            return plantParameters;
        case "herbivore":
            return herbivoreParameters;
        case "parasite":
            return parasiteParameters;
        case "vine":
            return vineParameters;
        case "gola":
            return gameOfLiveAliveParameters;
        case "gold":
            return gameOfLiveDeadParameters;
        default:
            return {};
    }
}
function updateProperty(selection, propertyName) {
    var selectedProperties = getPropertiesFromName(selection);
    var newValue = document.getElementsByName(propertyName)[0].value;
    selectedProperties[propertyName] = parseInt(newValue);
}
function squareClicked(x, y) {
    var organism = getOrganism(getSelected());
    for (var i = 0; i < brushSize; i++) {
        for (var j = 0; j < brushSize; j++) {
            grid.setOrganism(x + i, y + j, organism);
        }
    }
}
function mousedOver(x, y) {
    if (mouseDown) {
        squareClicked(x, y);
    }
}
function start() {
    running = true;
    document.getElementById("stop").disabled = false;
    document.getElementById("start").disabled = true;
    mainLoop();
}
function stop() {
    running = false;
    document.getElementById("stop").disabled = true;
    document.getElementById("start").disabled = false;
}
function reset() {
    grid.resetGrid();
}
function fill() {
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            grid.setOrganism(x, y, getOrganism(getSelected()));
        }
    }
}
function getOrganism(name) {
    switch (name) {
        case "plant":
            return new Plant();
        case "herbivore":
            return new Herbivore();
        case "parasite":
            return new Parasite();
        case "vine":
            return new Vine();
        case "wall":
            return new Wall();
        case "gola":
            return new GameOfLife();
        case "gold":
            return new GameOfLifeDead();
        default:
            return null;
    }
}
function updateBrushSize() {
    var val = document.getElementById("brush-size").value;
    brushSize = parseInt(val);
}
function updateMspf() {
    var val = document.getElementById("mspf").value;
    mspf = parseInt(val);
    localStorage.setItem("mspf", mspf.toString());
}
function setGridSize() {
    var val = document.getElementById("grid-size").value;
    gridSize = parseInt(val);
    localStorage.setItem("gridSize", gridSize.toString());
    svg.innerHTML = "";
    init();
}
function toggleGrid() {
    var val = document.getElementById("show-grid").checked;
    showGrid = val;
    init();
}
//# sourceMappingURL=main.js.map