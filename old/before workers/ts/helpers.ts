export function randomInt(min: number, max: number): number {
	max = Math.floor(max);
	min = Math.ceil(min);
	return Math.floor(Math.random() * (max - min)) + min;
}

export function randomSignedUnit(): number {
	return 2 * randomInt(0,2) - 1;
}

export function randomPercentage(percentageAsInteger: number): boolean {
	return Math.random() < (percentageAsInteger / 100);
}

export function integerSequence(min: number, max: number, step: number = 1): number[] {
	let result: number[] = [];
	max += 1;
	for (let i = min; i < max; i += step) {
		result.push(i);
	}
	return result;
}

export function randomOrdering(elements: number[]): number[] {
	let swap = function(array: number[], firstIndex: number, secondIndex: number) {
		let temp = array[firstIndex];
		array[firstIndex] = array[secondIndex];
		array[secondIndex] = temp;
	}

	for (let i = 0; i < elements.length; i++) {
		swap(elements, randomInt(0, elements.length), randomInt(0, elements.length));
	}

	return elements;
}