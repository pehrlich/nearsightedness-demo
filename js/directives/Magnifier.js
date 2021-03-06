function Magnifier(scene, renderer) {
  'strict mode';
  this.scene = scene;
  this.renderer = renderer;
  var magInnerRadius = 0.3;
  var magColor = 0xdddd11;

  this.texture = new THREE.WebGLRenderTarget(
    256, 256, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBFormat
    });

  this.mesh = new THREE.Mesh(
    new THREE.CircleBufferGeometry(magInnerRadius, 64),
    new THREE.MeshBasicMaterial({map: this.texture, side: THREE.DoubleSide})
  );
  this.mesh.name = "Lens";

  var magMaterial = new THREE.MeshPhongMaterial({
    color: magColor,
    emissive: 0x333300,
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  // , new THREE.MeshBasicMaterial( { color: 0xcccc00 } )
  var ring = new THREE.Mesh(
    new THREE.TorusBufferGeometry(magInnerRadius + 0.01, 0.02, 32, 100),
    magMaterial
  );
  ring.name = "mag ring";
  this.mesh.add(ring);

  var handle = new THREE.Mesh(
    new THREE.CylinderBufferGeometry(0.05, 0.05, 0.3, 32),
    magMaterial
  );
  handle.position.set(0.32, -0.32, 0);
  handle.rotation.z = Math.PI / 4;
  handle.name = "mag handle";
  this.mesh.add(handle);

  var crossHair = new THREE.Object3D();

  var crossHairMaterial = new THREE.MeshBasicMaterial(
    {color: 0xbbbbbb}
  );
  var crossHairGeom = new THREE.PlaneBufferGeometry(0.008, 0.09);

  var topCrosshair = new THREE.Mesh(crossHairGeom, crossHairMaterial);
  topCrosshair.position.set(0, 0.1, 0.01);
  crossHair.add(topCrosshair);

  var bottomCrosshair = new THREE.Mesh(crossHairGeom, crossHairMaterial);
  bottomCrosshair.position.set(0, -0.1, 0.01);
  crossHair.add(bottomCrosshair);

  var leftCrosshair = new THREE.Mesh(crossHairGeom, crossHairMaterial);
  leftCrosshair.position.set(0.1, 0, 0.01);
  leftCrosshair.rotation.z = Math.PI / 2;
  crossHair.add(leftCrosshair);

  var rightCrosshair = new THREE.Mesh(crossHairGeom, crossHairMaterial);
  rightCrosshair.position.set(-0.1, 0, 0.01);
  rightCrosshair.rotation.z = Math.PI / 2;
  crossHair.add(rightCrosshair);


  this.mesh.add(crossHair);


  this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  this.camera.position.set(0, 0, 0);
  this.camera.name = "magnifier camera";
  this.camera.zoom = 3;
  this.camera.updateProjectionMatrix();
  this.mesh.add(this.camera);
}

Magnifier.prototype = {
  update: function () {
    this.renderer.render(this.scene, this.camera, this.texture, true);
  }
};