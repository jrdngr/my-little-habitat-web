var Renderer = (function () {
    function Renderer(height, width, div, gridSize, backgroundColor) {
        this.height = parseInt(height);
        this.width = parseInt(width);
        this.div = div;
        this.gridSize = parseInt(gridSize);
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1, 1);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(backgroundColor, 1.0);
        this.renderer.setSize(this.width, this.height);
        this.div.appendChild(this.renderer.domElement);
    }
    Renderer.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };
    Renderer.prototype.createGridCell = function (x, y, color) {
        var size = parseInt(this.width / this.gridSize);
        var geometry = new THREE.PlaneGeometry(size, size);
        var material = new THREE.MeshBasicMaterial({ color: color });
        material.color.setRGB(Math.random(0, 1), Math.random(0, 1), Math.random(0, 1));
        var plane = new THREE.Mesh(geometry, material);
        geometry.translate(x, y, 0);
        this.scene.add(plane);
        return plane;
    };
    return Renderer;
}());
//# sourceMappingURL=drawing.js.map