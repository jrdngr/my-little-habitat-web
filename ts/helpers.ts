export function randomInt(min: number, max: number): number {
	max = Math.floor(max);
	min = Math.ceil(min);
	return Math.floor(Math.random() * (max - min)) + min;
}

export function randomSignedUnit(): number {
	return 2 * randomInt(0,2) - 1;
}