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
	document.body.onmousedown = function() {mouseDown = true;};
	document.body.onmouseup = function() {mouseDown = false;};
	document.body.onmouseleave = function() {mouseDown = false;};

	loadStoredValues();
	selectionChanged();
	svg = document.getElementById("canvas");
	grid = new Grid(svg, gridSize, gridSize, showGrid);

	mainLoop();
}

function mainLoop() {
	if(running) {
		if (Date.now() - lastFrame >  mspf) {
			lastFrame = Date.now();
			grid.runBehaviors();
		}	
		animationFrame = window.requestAnimationFrame(this.mainLoop.bind(this));
	}
}

function loadStoredValues() {
	let storedMspf = localStorage.getItem("mspf");
	if (storedMspf != null) {
		mspf = storedMspf;
		document.getElementById("mspf").value = mspf;
	}

	let storedSelection = localStorage.getItem("selection");
	if (storedSelection != null) {
		let options = document.getElementsByName("organism");
		options.forEach(function(option){
			if (option.value == storedSelection) {
				option.checked = true;
				return;
			}
		});
	}

	let storedGridSize = localStorage.getItem("gridSize");
	if (storedGridSize != null) {
		gridSize = storedGridSize;
		document.getElementById("grid-size").value = gridSize;
	}
}

function getSelected() {
	let options = document.getElementsByName("organism");
	let selected = null;
	options.forEach(function(option){
		if (option.checked) {
			selected = option.value;
			localStorage.setItem("selection", option.value);
		}
	});
	return selected;
}

function selectionChanged() {
	document.getElementById("brush-size").value = 1;
	brushSize = 1;
	
	let propertyDiv = document.getElementsByClassName("property-list")[0];
	let selected = getSelected();
	let selectedProperties = getPropertiesFromName(selected);
	let selectedName = "";

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

	Object.keys(selectedProperties).forEach(function(key) {
		let propertyName = document.createTextNode(key);
		let propertyBox = document.createElement("input");
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
	let selectedProperties = getPropertiesFromName(selection);
	let newValue = document.getElementsByName(propertyName)[0].value;
	selectedProperties[propertyName] = parseInt(newValue);
}

function squareClicked(x, y) {
	let organism = getOrganism(getSelected());
	for (let i = 0; i < brushSize; i++) {
		for (let j = 0; j < brushSize; j++) {
			grid.setOrganism(x+i, y+j, organism);
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
	mainLoop()
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
	for (let x = 0; x < grid.width; x++) {
		for (let y = 0; y < grid.height; y++) {
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
	let val = document.getElementById("brush-size").value;
	brushSize = parseInt(val);
}

function updateMspf() {
	let val = document.getElementById("mspf").value;
	mspf = val;
	localStorage.setItem("mspf", mspf);
}

function setGridSize() {
	let val = document.getElementById("grid-size").value;
	gridSize = val;
	localStorage.setItem("gridSize", gridSize);
	svg.innerHTML = "";
	init();
}

function toggleGrid() {
	let val = document.getElementById("show-grid").checked;
	showGrid = val;
	init();
}