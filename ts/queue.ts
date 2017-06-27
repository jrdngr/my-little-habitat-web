export class Queue<T> {

    RESIZE_AT_LENGTH: number = 100000000;  

    private data: T[];
    private current: number;

    constructor() {
        this.data = [];
        this.current = 0;
    }

    enqueue(item: T): void {
        this.data.push(item);
        if (this.data.length > this.RESIZE_AT_LENGTH) {
            this.resize();
            console.log(this.data.length);
        }
    }

    dequeue(): T {
        if (this.current < this.data.length) {
            return this.data[this.current++];
        } else {
            return null;
        }
    }

    hasNext(): boolean {
        return this.current != this.data.length;
    }

    resize() :void {
        this.data.splice(0, this.current);
        this.current = 0;
    }

    length(): number {
        return this.data.length;
    }

}