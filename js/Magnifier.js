function Magnifier(scene, renderer) {
  this.scene = scene;
  this.renderer = renderer;
  this.texture = new THREE.WebGLRenderTarget(
      256, 256, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
      } );

  var planeMaterial = new THREE.MeshBasicMaterial({ map: this.texture });


  this.mesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.3,32), planeMaterial);

  this.camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 );
  this.camera.position.set(0,0,0);
  this.camera.name = "magnifier camera";
  this.camera.zoom = 3;
  this.camera.updateProjectionMatrix();
  this.mesh.add( this.camera );
}

Magnifier.prototype = {
  update: function () {
    this.renderer.render(this.scene, this.camera, this.texture, true);
  }
};