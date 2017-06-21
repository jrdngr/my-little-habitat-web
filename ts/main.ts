import { OrganismGridManager } from "organism-grid-manager";
import { GridManager, Cell } from "grid";
import * as Organisms from "organisms";

const GRID_WIDTH: number = 200;
const GRID_HEIGHT: number = GRID_WIDTH;

let mouseDown: boolean = false;
let cellsPerStepMultiplier: number = 2;
let selected: string = "plant";

init();

function init() {

	const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
	canvas.height = window.innerHeight;
	canvas.width = canvas.height;

	const gridManager: GridManager = new OrganismGridManager(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);

	const xScale: number = canvas.width / gridManager.getDimensions()[0];
	const yScale: number = canvas.height / (gridManager.getDimensions()[1] - 1);
	
	let setCell = function (event: MouseEvent) {
		let rect: ClientRect = canvas.getBoundingClientRect();
		let [x, y] = getGridCoordinates(event, rect, xScale, yScale);
		let cell: Cell = gridManager.getCell(x, y);
		gridManager.setCellOccupant(x, y, Organisms.getOrganism(selected, cell));
	}

	let setSelectedElement = function() {
		let selectedElement: HTMLElement = document.getElementById("selected-organism");
		selectedElement.innerHTML = selected;
	}

	canvas.addEventListener('mousemove', function(event) {
		if (mouseDown) {
			setCell(event);
		}
	});
	canvas.addEventListener('mousedown', function(event) { 
		mouseDown = true;
		setCell(event);
	 });
	canvas.addEventListener('mouseup', function() { mouseDown = false });
	canvas.addEventListener('mouseleave',function() { mouseDown = false});

	document.onkeypress = function(event) {
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
		setSelectedElement();
	};

	setSelectedElement();

	mainLoop(gridManager);
}

function mainLoop(grid: GridManager) {
	grid.step();
	let animationFrame = window.requestAnimationFrame(mainLoop.bind(this, grid));
}

function getGridCoordinates(event: MouseEvent, rect: ClientRect, xScale: number, yScale: number): [number, number] {
	let x: number = Math.floor((event.clientX - rect.left) / xScale);
	let y: number = Math.floor((event.clientY - rect.top) / yScale);
	return [x, y];
}