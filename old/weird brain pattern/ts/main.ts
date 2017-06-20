import { Grid } from "grid";
import * as Organisms from "organisms";

const GRID_WIDTH: number = 200;
const GRID_HEIGHT: number = GRID_WIDTH;

let mouseDown: boolean = false;
let cellsPerStepMultiplier: number = 10;
let selected = "plant";


init();

function init() {
	const canvas = <HTMLCanvasElement>document.getElementById("canvas");
	canvas.height = window.innerHeight;
	canvas.width = canvas.height;

	const grid = new Grid(GRID_WIDTH, GRID_HEIGHT, canvas, cellsPerStepMultiplier);

	const xScale: number = canvas.width / grid.width;
	const yScale: number = canvas.height / (grid.height - 1);

	let setCell = function (event: MouseEvent) {
		let rect: ClientRect = canvas.getBoundingClientRect();
		let [x, y] = getGridCoordinates(event, rect, xScale, yScale);
		grid.setOccupant(x, y, Organisms.getOrganism(selected));
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
		console.log(selected);
	};

	mainLoop(grid);
}

function mainLoop(grid: Grid) {
	grid.step();
	let animationFrame = window.requestAnimationFrame(mainLoop.bind(this, grid));
}

function getGridCoordinates(event: MouseEvent, rect: ClientRect, xScale: number, yScale: number): [number, number] {
	let x: number = Math.floor((event.clientX - rect.left) / xScale);
	let y: number = Math.floor((event.clientY - rect.top) / yScale);
	return [x, y];
}