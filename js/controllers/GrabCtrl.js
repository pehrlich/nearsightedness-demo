// has a magnifying lens, which glows and the user can pick up


function GrabCtrl(cursor, scene, camera, renderer) {
  this.cursor = cursor;
  this.scene = scene;
  this.camera = camera;
  this.renderer = renderer;

  this.magGrabbed = false;
  this.magnifier = new Magnifier(scene, renderer);
  this.magnifier.mesh.position.set(0.7, 1.5, 2.3);
  this.magnifier.mesh.rotation.z = - Math.PI / 4;
  this.magnifier.mesh.addEventListener('click', this.onMagClick.bind(this));
  this.magnifier.mesh.addEventListener('click', this.onMagMouseOver.bind(this));
  this.magnifier.mesh.addEventListener('click', this.onMagMouseOut.bind(this));
  scene.add(this.magnifier.mesh);

}

GrabCtrl.prototype = {

  onMagMouseOver: function () {
    console.log('mouse over');
  },

  onMagMouseOut: function () {
    console.log('mouse out');
  },

  onMagClick: function () {
    console.log('mag click');
    this.magGrabbed = true;
    this.cursor.group.children[0].visible = false;

    THREE.SceneUtils.detach(this.magnifier.mesh, this.scene, this.cursor.group);
    this.magnifier.mesh.position.set(0,0,0);
    this.magnifier.mesh.rotation.z = 0;
  },

  update: function (timestamp) {
    this.magnifier.update();
  }

};