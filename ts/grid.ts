const CELL_OVERLAP = 1;

export class Grid {
	width: number;
	height: number;
	
	private canvas: HTMLCanvasElement;
	private context: CanvasRenderingContext2D;
	private cells: Cell[];
	private cellWidth: number;
	private cellHeight: number;

	constructor(width, height, canvas) {
		this.width = width;
		this.height = height;
		this.canvas = canvas;
		
		this.context = canvas.getContext("2d");
		this.cells = [];

		this.cellWidth = this.canvas.width / width;
		this.cellHeight = this.canvas.height / height;

		this.createGrid();
		this.drawFullGrid();
	}

	createGrid(): void {
		for(let i = 0; i < this.width * this.height; i++) {
			this.cells.push(new Cell(i % this.width, Math.floor(i / this.width)));
		}
	}

	getCell(x: number, y: number): Cell {
		return this.cells[this.getIndex(x, y)];
	}

	getIndex(x: number, y: number): number {
		if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
			return null;
		} else {
			return y * this.width + x;
		} 
	}

	setOccupant(x: number, y: number, occupant: Occupant): void {
		let index = this.getIndex(x, y);
		if (index != null) {
			this.cells[index].occupant = occupant;
			this.drawCell(x, y);
		}
	}

	clearCell(x: number, y: number): void {
		let index = this.getIndex(x, y);
		if (index != null) {
			let cell: Cell = this.cells[index];
			cell.occupant = new Empty(cell);
			this.drawCell(x, y);
		}
	}

	drawCell(x: number, y: number) {
		let rectX = Math.floor((x * this.cellWidth) - CELL_OVERLAP);
		let rectY = Math.floor((y * this.cellHeight) - CELL_OVERLAP);
		let rectWidth = Math.floor(this.cellWidth + CELL_OVERLAP); 
		let rectHeight = Math.floor(this.cellHeight + CELL_OVERLAP);

		this.context.fillStyle = this.getCell(x, y).occupant.color;
		this.context.fillRect(rectX, rectY, rectWidth, rectHeight);
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
}

export interface GridManager {
	readonly grid: Grid;
	step(): void;
	setCellOccupant(x: number, y: number, occupant: Occupant): void;
	getCell(x: number, y: number): Cell;
	getNeighborhood(x: number, y: number, name?: string);
}

export class Cell {
	x: number;
	y: number;
	occupant: Occupant;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.occupant = new Empty(this);
	}
}

export class Occupant {
	name: string;
	color: string;
	readonly cell: Cell;

	constructor(name: string, color: string, cell: Cell) {
		this.name = name;
		this.color = color;
		this.cell = cell;
	}
}

class Empty extends Occupant {
	constructor(cell: Cell) {
		super("empty", "black", cell);
	}
}