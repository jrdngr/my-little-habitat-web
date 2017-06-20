const CELL_OVERLAP = 1;

export class Grid {
	width: number;
	height: number;
	
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private cells: Cell[];
	private turnQueue: number[];
	private cellWidth: number;
	private cellHeight: number;
	private cellsPerStepMultiplier: number;

	constructor(width, height, canvas, cellsPerStepMultiplier = 10) {
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		this.cellsPerStepMultiplier = cellsPerStepMultiplier;
		
		this.context = canvas.getContext("2d");
		this.cells = [];
		this.turnQueue = [];
		this.cellWidth = this.canvas.width / width;
		this.cellHeight = this.canvas.height / height;

		this.createGrid();
		this.drawFullGrid();
	}

	createGrid() {
		for(let i = 0; i < this.width * this.height; i++) {
			this.cells.push(new Cell(i % this.width, Math.floor(i / this.width)));
		}
	}

	getCell(x: number, y: number) {
		return this.cells[this.getIndex(x, y)];
	}

	getIndex(x: number, y: number) {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return null;
		} else {
			return y * this.width + x;
		} 
	}

	setOccupant(x: number, y: number, occupant: Occupant) {
		let index = this.getIndex(x, y);
		if (index != null) {
			this.cells[index].occupant = occupant;
			this.turnQueue.push(index);
			this.drawCell(x, y);
			this.addToTurnQueue(this.cells[index]);
		}
	}

	clearCell(x: number, y: number) {
		let index = this.getIndex(x, y);
		if (index != null) {
			this.cells[index].occupant = new Empty();
			this.drawCell(x, y);
		}
	}

	step() {
		let cellsPerStep = this.turnQueue.length * this.cellsPerStepMultiplier;
		let cellsProcessed = 0;
		while (cellsProcessed < cellsPerStep) {
			if (this.turnQueue.length > 0) {
				let index = this.turnQueue.shift();
				this.runCellBehavior(index);
			}
			else{
				break;
			}
			cellsProcessed++;
		}
	}

	drawCell(x: number, y: number) {
		this.context.fillStyle = this.getCell(x, y).occupant.color;
		this.context.fillRect((x * this.cellWidth) - CELL_OVERLAP, 
							  (y * this.cellHeight) - CELL_OVERLAP, 
							  this.cellWidth + CELL_OVERLAP, 
							  this.cellHeight + CELL_OVERLAP);
	}

	drawFullGrid() {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.drawCell(x, y);
			}
		}
	}

	drawGridLines(color: string) {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				this.context.strokeStyle = color;
				this.context.beginPath();
				this.context.moveTo(x * this.cellWidth, 0);
				this.context.lineTo(x * this.cellWidth, this.canvas.height);
				this.context.moveTo(0, y * this.cellHeight);
				this.context.lineTo(this.canvas.width, y * this.cellHeight);
				this.context.stroke();
			}
		}
	}

	getNeighbors(x: number, y: number, type?: string, radius: number = 0) {
		let neighbors: Cell[] = [];
		neighbors.push(this.getCell(x, y));
		neighbors.push(this.getCell(x, y-1));
		neighbors.push(this.getCell(x+1, y));
		neighbors.push(this.getCell(x, y+1));
		neighbors.push(this.getCell(x-1, y));
		if (radius > 0) {
			neighbors.push(this.getCell(x+1, y-1));
			neighbors.push(this.getCell(x+1, y+1));
			neighbors.push(this.getCell(x-1, y+1));
			neighbors.push(this.getCell(x-1, y-1));
		}
		return neighbors;
	}

	addToTurnQueue(cell: Cell) {
		if (cell) {
			this.turnQueue.push(cell.y * this.width + cell.x); 
		}
	}

	runCellBehavior(index: number) {
		let x = index % this.width;
		let y = Math.floor(index / this.width);
		this.cells[index].occupant.behavior(this.getNeighbors(x, y), this);	
	}

	runAllBehaviors() {
		console.log("reset");
		this.turnQueue = [];
		for (let i = 0; i < this.cells.length; i++) {
			this.runCellBehavior(i);
		}
	}
}

export class Cell {
	x: number;
	y: number;
	occupant: Occupant;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.occupant = new Empty();
	}
}

export class Occupant {
	name: string;
	color: string;
	behavior: (neighbors: Cell[], grid: Grid) => void;
	neighborhoodRadius: number;

	constructor(name, color, behavior?, neighborhoodRadius = 1) {
		this.name = name;
		this.color = color;
		this.behavior = behavior || function(){ };
		this.neighborhoodRadius = neighborhoodRadius;
	}
}

class Empty extends Occupant {
	constructor() {
		super("empty", "black");
	}
}