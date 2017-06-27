define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Queue {
        constructor() {
            this.RESIZE_AT_LENGTH = 100000000;
            this.data = [];
            this.current = 0;
        }
        enqueue(item) {
            this.data.push(item);
            if (this.data.length > this.RESIZE_AT_LENGTH) {
                this.resize();
                console.log(this.data.length);
            }
        }
        dequeue() {
            if (this.current < this.data.length) {
                return this.data[this.current++];
            }
            else {
                return null;
            }
        }
        hasNext() {
            return this.current != this.data.length;
        }
        resize() {
            this.data.splice(0, this.current);
            this.current = 0;
        }
        length() {
            return this.data.length;
        }
    }
    exports.Queue = Queue;
});
//# sourceMappingURL=queue.js.map