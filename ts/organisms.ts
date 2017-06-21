import { GridManager, Cell, Occupant } from "grid";
import { OrganismGridManager } from "organism-grid-manager";
import { randomInt, randomSignedUnit, randomPercentage } from "helpers";

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
}

export class Plant extends Organism {
	constructor(cell: Cell, startEnergy: number = 0) {
		super("plant", "green", cell);
		this.energy = startEnergy;
		this.behavior = function(grid: GridManager) {
			let gridManager: OrganismGridManager = <OrganismGridManager>grid; 
			if (randomPercentage(1)) {
				gridManager.cloneRandom(this);
			} else {
				gridManager.addToTurnQueue(this);
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
			let neighbors: Cell[] = gridManager.getNeighborhood(this);
			if (this.energy <= 0) {
				gridManager.kill(this);
			} else {
				let plantNeighbors = gridManager.getNeighborhoodOfType(this, "plant");
				if (plantNeighbors.length > 0) {
					let index = randomInt(0, plantNeighbors.length);
					let newX = plantNeighbors[index].x;
					let newY = plantNeighbors[index].y;
					let newEnergy;
					if (this.energy <= 200) {
						newEnergy = this.energy + 5;
						gridManager.move(this, newX, newY);
						gridManager.kill(this);
					} else {
						this.energy = Math.floor(this.energy / 2);
						gridManager.clone(this, newX, newY);
					}
					neighbors.forEach(neighbor => {
						if (neighbor && neighbor.occupant) {
							gridManager.addToTurnQueue(neighbor.occupant);
						}
					});
				} else {
					this.energy -= 3;
					if (this.energy % 10 == 0) {
						let newX = this.cell.x + randomSignedUnit();
						let newY = this.cell.y + randomSignedUnit();
						gridManager.move(this, newX, newY);
					} else {
						gridManager.addToTurnQueue(this);
					}
				}
			}
		}
	}
}