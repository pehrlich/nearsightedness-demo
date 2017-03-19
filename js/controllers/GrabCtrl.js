// has a magnifying lens, which glows and the user can pick up


function GrabCtrl(cursor, scene, camera, renderer) {
  this.cursor = cursor;
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;

  this.magGrabbed = false;
  this.magnifier = new Magnifier(scene, renderer);
  this.magnifier.mesh.position.set(0.7, 1.5, 2.3);
  this.magnifier.mesh.rotation.z = -Math.PI / 4;
  this.magnifier.mesh.addEventListener('click', this.onMagClick.bind(this));
  this.magnifier.mesh.addEventListener('mouseover', this.onMagMouseOver.bind(this));
  this.magnifier.mesh.addEventListener('mouseout', this.onMagMouseOut.bind(this));
  scene.add(this.magnifier.mesh);

}

GrabCtrl.prototype = {

  onMagMouseOver: function () {
    var mesh = this.magnifier.mesh.getObjectByName( "mag ring" );
    if ( mesh.userData.origEmissive === undefined) mesh.userData.origEmissive = mesh.material.emissive.getHex();
    mesh.material.emissive.setHex(0x999933);
  },

  onMagMouseOut: function () {
    var mesh = this.magnifier.mesh.getObjectByName( "mag ring" );
    mesh.material.emissive.setHex(mesh.userData.origEmissive);
  },

  onMagClick: function (event) {
    this.magGrabbed = true;
    this.cursor.group.children[0].visible = false;

    THREE.SceneUtils.detach(this.magnifier.mesh, this.scene, this.cursor.group);
    this.magnifier.mesh.position.set(0, 0, 0);
    this.magnifier.mesh.rotation.set(0, 0, 0);

    this.cursor.removeObject(this.magnifier.mesh);
    event.stopPropagation = true;
  },

  update: function (timestamp) {
    if (!this.magGrabbed) {
      this.magnifier.mesh.rotation.y += 0.005;
    }
    this.magnifier.update();
  }

};