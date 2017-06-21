import { Grid, GridManager, Cell, Occupant } from "grid";
import { Organism, getOrganism } from "organisms";
import { randomInt } from "helpers";

const MAX_CELLS_PER_STEP = 10000;

export class OrganismGridManager implements GridManager {

    private readonly grid: Grid;

  	private turnQueue: number[];
	private cellsPerStepMultiplier: number;

    constructor(width, height, canvas, cellsPerStepMultiplier = 1) {
        this.grid = new Grid(width, height, canvas);
     	this.turnQueue = [];
		this.cellsPerStepMultiplier = cellsPerStepMultiplier;
    }

    step() {
		let cellsPerStep = Math.min(this.turnQueue.length * this.cellsPerStepMultiplier, MAX_CELLS_PER_STEP);
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

    setCellOccupant(x: number, y: number, occupant: Occupant): void {
        this.grid.setOccupant(x, y, occupant);
		this.addToTurnQueue(occupant);
    }
	
	clearCell(x:number, y: number): void {
		this.grid.clearCell(x, y);
	}

    getCell(x: number, y: number): Cell {
        return this.grid.getCell(x, y);
    }

	getNeighborhood(occupant: Occupant, useDiagonals: boolean = false): Cell[] {
		return this.getNeighborhoodOfCell(occupant.cell.x, occupant.cell.y, useDiagonals);
	}

    getNeighborhoodOfCell(x: number, y: number, useDiagonals: boolean = false) {
		let neighbors: Cell[] = [];
		neighbors.push(this.grid.getCell(x, y));
		neighbors.push(this.grid.getCell(x, y-1));
		neighbors.push(this.grid.getCell(x+1, y));
		neighbors.push(this.grid.getCell(x, y+1));
		neighbors.push(this.grid.getCell(x-1, y));
		if (useDiagonals) {
			neighbors.push(this.grid.getCell(x+1, y-1));
			neighbors.push(this.grid.getCell(x+1, y+1));
			neighbors.push(this.grid.getCell(x-1, y+1));
			neighbors.push(this.grid.getCell(x-1, y-1));
		}
		return neighbors;
	}

	getNeighborhoodOfType(occupant: Occupant, type: string, useDiagonals: boolean = false) {
		return this.getNeighborhood(occupant, useDiagonals).filter(neighbor => {
			if (neighbor) {
				return neighbor.occupant.name == type;
			} else {
				return false;
			}
		});
	}

	getDimensions(): [number, number] {
		return [this.grid.width, this.grid.height];
	}

    addToTurnQueue(occupant: Occupant) {
		if (occupant && occupant.cell) {
			this.turnQueue.push(occupant.cell.y * this.grid.width + occupant.cell.x); 
		}
	}

	runCellBehavior(index: number) {
		let x = index % this.grid.width;
		let y = Math.floor(index / this.grid.width);
		let organism: Organism = <Organism>this.getCell(x, y).occupant;
		if (organism.behavior) {
			organism.behavior(this);	
		}
	}

	/*
	 * Common beaviors
	 */

	 move(organism: Organism, newX: number, newY: number): void {
		this.clone(organism, newX, newY, organism.energy);
		this.kill(organism);
	 }

	 moveRandom(organism: Organism, availableCells?: Cell[]): void {
		if (!availableCells) {
			availableCells = this.getNeighborhoodOfType(organism, "empty");
		}
		if (availableCells.length > 0) {
			this.cloneRandom(organism, availableCells);
			this.kill(organism);
		}
	 }

	 clone(organism: Organism, newX: number, newY: number, startingEnergy?: number): void {
		let newCell: Cell = this.getCell(newX, newY);
		let newOrganism: Organism = getOrganism(organism.name, newCell);
		newOrganism.energy = startingEnergy || organism.energy;
		this.setCellOccupant(newX, newY, newOrganism);
		this.addToTurnQueue(organism);
	 }

	 cloneRandom(organism: Organism, availableCells?: Cell[]): void {
		if (!availableCells) {
			availableCells = this.getNeighborhoodOfType(organism, "empty");
		}
		if (availableCells.length > 0) {
			let index = randomInt(0, availableCells.length);
			let newX = availableCells[index].x;
			let newY =  availableCells[index].y;
			this.clone(organism, newX, newY);
		}
	 }

	 kill(organism: Organism) {
		 this.clearCell(organism.cell.x, organism.cell.y);
	 }
}