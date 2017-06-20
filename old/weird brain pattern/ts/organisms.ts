import { Cell, Occupant } from "grid";
import { randomInt } from "helpers";
import { Neighbor } from "neighbors";

export const getOrganism = function(name: string): Organism {
	name = name.toLocaleLowerCase();
	switch(name) {
		case "plant":
			return new Plant();
		case "herbivore":
			return new Herbivore();
		default:
			return new Plant(); 
	}

}

export class Organism extends Occupant {
	energy: number;

	constructor(name, color) {
		super(name, color);
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
	constructor(startEnergy = 0) {
		super("plant", "green");
		this.energy = startEnergy;
		this.behavior = function(neighbors, grid) {
			if (this.energy < 1) {
				if (randomInt(0, 100) == 1)
				{
					this.energy++;
				}
				grid.addToTurnQueue(neighbors[Neighbor.Self]);
			}
			else {
				let emptyNeighbors = this.getNeighborsOfType(neighbors, "empty");
				if (emptyNeighbors.length > 0) {
					let index = randomInt(0, emptyNeighbors.length);
					let newX = emptyNeighbors[index].x;
					let newY = emptyNeighbors[index].y;
					grid.setOccupant(newX, newY, new Plant());
					this.energy = 0;
					grid.addToTurnQueue(neighbors[Neighbor.Self]);
				}
			}
		}
	}
}

export class Herbivore extends Organism {
	constructor(startEnergy = 100) {
		super("herbivore", "blue");
		this.energy = startEnergy;
		this.behavior = function(neighbors, grid) {
			let x = neighbors[Neighbor.Self].x;
			let y = neighbors[Neighbor.Self].y;

			if (this.energy <= 0) {
				grid.clearCell(x, y);
			}
			else {
				let plantNeighbors = this.getNeighborsOfType(neighbors, "plant");
				if (plantNeighbors.length > 0) {
					let index = randomInt(0, plantNeighbors.length);
					let newX = plantNeighbors[index].x;
					let newY = plantNeighbors[index].y;
					grid.setOccupant(newX, newY, new Herbivore());
					grid.clearCell(x, y);
					neighbors.forEach(neighbor => {
						grid.addToTurnQueue(neighbor);
					});
				}
				else {
					this.energy--;
					grid.addToTurnQueue(neighbors[Neighbor.Self]);
				}
			}
		}
	}
}