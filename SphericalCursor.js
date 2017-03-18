var SphericalCursor = function (camera, scene) {
  'strict mode';
  this.camera = camera;
  this.scene = scene;
  this.SENSITIVITY = 0.01;              // to adjust how sensitive the mouse control is
  this.DISTANCE_SCALE_FACTOR = -0.05;  // to scale down the cursor based on its collision distance
  this.DEFAULT_CURSOR_SCALE = 0.6;     // scale to set the cursor if no raycast hit is found
  this.MAX_DISTANCE = 100;             // maximum distance to raycast
  this.SPHERE_RADIUS = 20;           // sphere radius to project cursor onto if no raycast hit
  this.mouse = new THREE.Vector2();
  this.raycaster = new THREE.Raycaster();
  this.clickable_objects = [];
  this.active = false;
  this.currentTarget = null;

  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.2),
    new THREE.MeshPhongMaterial({color: "#FFFFFF"})
  );
  this.mesh.name = "cursor";
  this.mesh.material.depthTest = false;

  camera.add(this.mesh);

  window.addEventListener("mousemove", this.onMouseMove.bind(this));
};

SphericalCursor.prototype = {
  onMouseMove: function (event) {
    if (!this.active) return;
    this.mouse.x += (event.movementX || event.mozMovementX || event.webkitMovementX || 0) * this.SENSITIVITY;
    this.mouse.y -= (event.movementY || event.mozMovementY || event.webkitMovementY || 0) * this.SENSITIVITY;
    this.raycaster.setFromCamera(this.mouse, this.camera);
  },

  update: function () {
    if (!this.active) return;

    this.mesh.position.copy(
      this.raycaster.ray.direction.normalize()
    ).multiplyScalar(this.SPHERE_RADIUS);


    var intersects = this.raycaster.intersectObjects(this.clickable_objects, true);

    if (intersects.length > 0) {
      if (this.currentTarget != intersects[0].object) {
        if (this.currentTarget) this.currentTarget.material.emissive.setHex(this.currentTarget.currentHex);
        this.currentTarget = intersects[0].object;
        this.currentTarget.userData.origColor = this.currentTarget.material.emissive.getHex();
        this.currentTarget.material.emissive.setHex(0xff0000);
        // todo: emit mouseover
      }
    } else {
      if (this.currentTarget) {
        this.currentTarget.material.emissive.setHex(this.currentTarget.currentHex);
        this.currentTarget = null;
        // todo: emit mouseout
      }
      this.currentTarget = null;
    }

  },

  addObject: function (o) {
    this.clickable_objects.push(o);
  },

  activate: function () {
    this.active = true;
  },

  deactivate: function () {
    this.active = false;
  }

};

