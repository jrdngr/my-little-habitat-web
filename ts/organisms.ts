import { GridManager, Cell, Occupant } from "grid";
import { OrganismGridManager } from "organism-grid-manager";
import { randomInt, randomSignedUnit } from "helpers";
import { Neighbor } from "neighbors";

export const getOrganism = function(name: string, cell: Cell): Organism {
	name = name.toLowerCase();
	switch(name) {
		case "plant":
			return new Plant(cell);
		case "herbivore":
			return new Herbivore(cell);
		default:
			return new Plant(cell); 
	}
}

export class Organism extends Occupant {
	energy: number;
	behavior: (grid: GridManager) => void;

	constructor(name: string, color: string, cell: Cell, behavior?) {
		super(name, color, cell);
		this.behavior = behavior || function(){ };

	}

	getNeighborsOfType(neighbors: Cell[], name: string) {
		let result: Cell[] = [];
		neighbors.forEach(function(neighbor) {
			if (neighbor && neighbor.occupant.name == name) {
				result.push(neighbor);
			}
		});

		return result;
	}
}

export class Plant extends Organism {
	constructor(cell: Cell, startEnergy: number = 0) {
		super("plant", "green", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid; 
			let neighbors: Cell[] = gridManager.getNeighborhood(this.cell.x, this.cell.y);
			if (this.energy < 1) {
				if (randomInt(0, 100) == 1)
				{
					this.energy++;
				}
				gridManager.addToTurnQueue(this.cell);
			} else {
				let emptyNeighbors = this.getNeighborsOfType(neighbors, "empty");
				if (emptyNeighbors.length > 0) {
					let index = randomInt(0, emptyNeighbors.length);
					let newCell = gridManager.grid.getCell(emptyNeighbors[index].x, emptyNeighbors[index].y)
					gridManager.setCellOccupant(newCell.x, newCell.y, new Plant(newCell));
					this.energy = 0;
					gridManager.addToTurnQueue(this.cell);
				}
			}
		}
	}
}

export class Herbivore extends Organism {
	constructor(cell: Cell, startEnergy: number = 50) {
		super("herbivore", "blue", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid;
			let neighbors: Cell[] = gridManager.getNeighborhood(this.cell.x, this.cell.y);
			if (this.energy <= 0) {
				gridManager.grid.clearCell(this.cell.x, this.cell.y);
			} else {
				let plantNeighbors = this.getNeighborsOfType(neighbors, "plant");
				if (plantNeighbors.length > 0) {
					let index = randomInt(0, plantNeighbors.length);
					let newX = plantNeighbors[index].x;
					let newY = plantNeighbors[index].y;
					let newEnergy;
					if (this.energy <= 200) {
						newEnergy = this.energy + 5;
						gridManager.grid.clearCell(this.cell.x, this.cell.y);
					} else {
						this.energy = Math.floor(this.energy / 2);
						newEnergy = this.energy;
					}
					let newCell: Cell = gridManager.getCell(newX, newY);
					gridManager.setCellOccupant(newX, newY, new Herbivore(newCell, newEnergy));
					neighbors.forEach(neighbor => {
						gridManager.addToTurnQueue(neighbor);
					});
				} else {
					this.energy -= 3;
					if (this.energy % 10 == 0) {
						let newX = this.cell.x + randomSignedUnit();
						let newY = this.cell.y + randomSignedUnit();
						let newCell: Cell = gridManager.getCell(newX, newY);
						gridManager.setCellOccupant(newX, newY, new Herbivore(newCell, this.energy));
						gridManager.grid.clearCell(this.cell.x, this.cell.y);
					} else {
						gridManager.addToTurnQueue(this.cell);
					}
				}
			}
		}
	}
}