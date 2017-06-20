import { Grid, GridManager, Cell, Occupant } from "grid";
import { Organism } from "organisms";

export class OrganismGridManager implements GridManager {

    grid: Grid;

  	private turnQueue: number[];
	private cellsPerStepMultiplier: number;

    constructor(width, height, canvas, cellsPerStepMultiplier = 1) {
        this.grid = new Grid(width, height, canvas);
     	this.turnQueue = [];
		this.cellsPerStepMultiplier = cellsPerStepMultiplier;
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

    setCellOccupant(x: number, y: number, occupant: Occupant): void {
        this.grid.setOccupant(x, y, occupant);
    }
	
    getCell(x: number, y: number): Cell {
        return this.grid.getCell(x, y);
    }

    getNeighborhood(x: number, y: number, name?: string) {
		let neighbors: Cell[] = [];
		neighbors.push(this.grid.getCell(x, y));
		neighbors.push(this.grid.getCell(x, y-1));
		neighbors.push(this.grid.getCell(x+1, y));
		neighbors.push(this.grid.getCell(x, y+1));
		neighbors.push(this.grid.getCell(x-1, y));
        neighbors.push(this.grid.getCell(x+1, y-1));
        neighbors.push(this.grid.getCell(x+1, y+1));
        neighbors.push(this.grid.getCell(x-1, y+1));
        neighbors.push(this.grid.getCell(x-1, y-1));
		if (name) {
			let indicesToRemove: number[] = [];
			neighbors.forEach(neighbor => {
				if (neighbor.occupant.name != name) {
					neighbor = null;		
				}
			});
		}

		return neighbors;
	}

    addToTurnQueue(cell: Cell) {
		if (cell) {
			this.turnQueue.push(cell.y * this.grid.width + cell.x); 
		}
	}

	runCellBehavior(index: number) {
		let x = index % this.grid.width;
		let y = Math.floor(index / this.grid.width);
		let organism: Organism = <Organism>this.getCell(x, y).occupant;
		organism.behavior(this);	
	}

}