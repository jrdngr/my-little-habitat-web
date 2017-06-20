define(["require", "exports", "organisms"], function (require, exports, Organisms) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UI = (function () {
        function UI(canvas, grid) {
            this.cellsPerStepMultiplier = 1;
            this.canvas = canvas;
            this.grid = grid;
            this.xScale = canvas.width / grid.width;
            this.yScale = canvas.height / (grid.height - 1);
            this.setMouseListeners();
        }
        UI.prototype.setMouseListeners = function () {
            var setCell = function (event) {
                var rect = this.canvas.getBoundingClientRect();
                var _a = this.getGridCoordinates(event, rect, this.xScale, this.yScale), x = _a[0], y = _a[1];
                this.grid.setOccupant(x, y, Organisms.getOrganism(UI.selected));
            };
            this.canvas.addEventListener('mousemove', function (event) {
                if (UI.mouseDown) {
                    setCell(event);
                }
            });
            this.canvas.addEventListener('mousedown', function (event) {
                UI.mouseDown = true;
                setCell(event);
            });
            this.canvas.addEventListener('mouseup', function () { UI.mouseDown = false; });
            this.canvas.addEventListener('mouseleave', function () { UI.mouseDown = false; });
            document.onkeypress = function (event) {
                switch (event.keyCode) {
                    case 49:
                        UI.selected = "plant";
                        break;
                    case 50:
                        UI.selected = "herbivore";
                        break;
                    default:
                        break;
                }
            };
        };
        UI.prototype.getGridCoordinates = function (event, rect, xScale, yScale) {
            var x = Math.floor((event.clientX - rect.left) / xScale);
            var y = Math.floor((event.clientY - rect.top) / yScale);
            return [x, y];
        };
        return UI;
    }());
    UI.mouseDown = false;
    UI.selected = "plant";
    exports.UI = UI;
});
//# sourceMappingURL=ui.js.map