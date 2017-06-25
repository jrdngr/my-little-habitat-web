import { OrganismGridManager } from "organism-grid-manager";
import { GridManager, Cell } from "grid";
import { getOrganism } from "organisms";

const GRID_WIDTH: number = 200;
const GRID_HEIGHT: number = GRID_WIDTH;

let mouseDown: boolean = false;
let cellsPerStepMultiplier: number = 5;
let selected: string = "plant";

let selections: HTMLInputElement[] = [];

let brushSizeElement: HTMLInputElement;
let brushSize: number;

init();

function init(): void {

	const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
	canvas.height = window.innerHeight;
	canvas.width = canvas.height;

	const gridManager: GridManager = new OrganismGridManager(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);

	const xScale: number = canvas.width / gridManager.getDimensions()[0];
	const yScale: number = canvas.height / (gridManager.getDimensions()[1] - 1);
	
	let setCell = function (event: MouseEvent) {
		let rect: ClientRect = canvas.getBoundingClientRect();
		let [x, y] = getGridCoordinates(event, rect, xScale, yScale);
		for (let i = 0; i < brushSize; i++) {
			for (let j = 0; j < brushSize; j++) {
				let cell: Cell = gridManager.getCell(x+i, y+j);
				gridManager.setCellOccupant(x+i, y+j, getOrganism(selected, cell));
			}
		}
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

	createControls();
	brushSizeChanged();

	mainLoop(gridManager);
}

function mainLoop(grid: GridManager): void {
	grid.step();
	let animationFrame = window.requestAnimationFrame(mainLoop.bind(this, grid));
}

function getGridCoordinates(event: MouseEvent, rect: ClientRect, xScale: number, yScale: number): [number, number] {
	let x: number = Math.floor((event.clientX - rect.left) / xScale);
	let y: number = Math.floor((event.clientY - rect.top) / yScale);
	return [x, y];
}

function createControls(): void {
	selections.push(<HTMLInputElement>document.getElementById('organism-plant'));
	selections.push(<HTMLInputElement>document.getElementById('organism-herbivore'));
	selections.push(<HTMLInputElement>document.getElementById('organism-parasite'));
	selections.push(<HTMLInputElement>document.getElementById('organism-vine'));
	selections.push(<HTMLInputElement>document.getElementById('organism-wall'));
	selections.push(<HTMLInputElement>document.getElementById('organism-empty'));


	selections.forEach(selection => selection.onclick = selectionChanged);

	brushSizeElement = <HTMLInputElement>document.getElementById('brush-size');
	brushSizeElement.onchange = brushSizeChanged;
}

function selectionChanged(): void {
	selections.forEach(selection => {
		if (selection.checked) {
			selected = selection.value;
		}
	});
}

function brushSizeChanged(): void {
	brushSize = parseInt(brushSizeElement.value);
}