function Magnifier(scene, renderer) {
  'strict mode';
  this.scene = scene;
  this.renderer = renderer;
  var magInnerRadius = 0.3;

  this.texture = new THREE.WebGLRenderTarget(
      256, 256, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
      } );

  var planeMaterial = new THREE.MeshBasicMaterial({ map: this.texture });

  this.mesh = new THREE.Mesh( new THREE.CircleBufferGeometry(magInnerRadius,64), planeMaterial);

  var ring = new THREE.Mesh(
    new THREE.RingBufferGeometry( magInnerRadius, magInnerRadius + 0.01, 32 )
    , new THREE.MeshBasicMaterial( { color: 0xcccc00, side: THREE.DoubleSide } )
  );
  this.mesh.add( ring );

  var cylinder = new THREE.Mesh(
    new THREE.CylinderBufferGeometry( 0.05, 0.05, 0.3, 32 ),
    new THREE.MeshBasicMaterial( {color: 0xcccc00} )
  );
  cylinder.position.set(0.32, -0.32, 0);
  cylinder.rotation.z = Math.PI / 4;
  this.mesh.add( cylinder );


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