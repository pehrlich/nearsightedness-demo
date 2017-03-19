var SphericalCursor = function (camera, scene) {
  'strict mode';
  this.camera = camera;
  this.scene = scene;
  this.SENSITIVITY = 0.01;              // to adjust how sensitive the mouse control is
  this.DISTANCE_SCALE_FACTOR = -0.05;  // to scale down the cursor based on its collision distance
  this.DEFAULT_CURSOR_SCALE = 0.6;     // scale to set the cursor if no raycast hit is found
  this.MAX_DISTANCE = 100;             // maximum distance to raycast
  this.SPHERE_DISTANCE = 2;           // sphere radius to project cursor onto if no raycast hit
  this.mouse = new THREE.Vector2();
  this.raycaster = new THREE.Raycaster();
  this.clickable_objects = [];
  this.active = false;
  this.currentTarget = null;
  this._hoveredElements = [];

  // todo: make brighter?
  var mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.05, 16, 16),
    new THREE.MeshPhongMaterial({color: "#FFFFFF"})
  );
  mesh.name = "cursor";
  mesh.material.depthTest = false;
  mesh.visible = true;

  this.group = new THREE.Object3D();
  this.group.add(mesh);

  camera.add(this.group);

  window.addEventListener("mousemove", this.onMouseMove.bind(this));
  window.addEventListener("click", function () {
    this._hoveredElements.map(function (mesh) {
      this.bubbleEvent(mesh, 'click');
    }.bind(this))
  }.bind(this));
};

SphericalCursor.prototype = {
  onMouseMove: function (event) {
    if (!this.active) return;
    this.mouse.x += (event.movementX || event.mozMovementX || event.webkitMovementX || 0) * this.SENSITIVITY;
    this.mouse.y -= (event.movementY || event.mozMovementY || event.webkitMovementY || 0) * this.SENSITIVITY;
    this.raycaster.setFromCamera(this.mouse, this.camera);
  },


  bubbleEvent: function (mesh, type) {
    var payload = {type: type, stopPropagation: false};
    mesh.dispatchEvent(payload);
    if (mesh.parent && !payload.stopPropagation) this.bubbleEvent(mesh.parent, type);
  },

  update: function () {
    if (!this.active) return;

    this.group.position.copy(
      this.raycaster.ray.direction
    ).multiplyScalar(this.SPHERE_DISTANCE);

    this.group.lookAt(this.raycaster.ray.direction);


    var intersects = this.raycaster.intersectObjects(this.clickable_objects, true);
    var target = this.currentTarget;

    if (intersects.length > 0) {
      if (target != intersects[0].object) {
        if (target) this._unHover(target);
        this.currentTarget = target = intersects[0].object;
        this._hoveredElements.push(target);
        this.bubbleEvent(target, 'mouseover');
      }
    } else {
      if (target) {
        this.currentTarget = null;
        // dispatch afterwards in case this causes an exception, we still have nulled our target
        this._unHover(target);
        this.bubbleEvent(target, 'mouseout');
      }
    }

  },

  _unHover: function (o) {
    for (var i = 0; i < this._hoveredElements.length; i++) {
      if (this._hoveredElements[i] == o) {
        this._hoveredElements.splice(i, 1);
        break
      }
    }
  },

  addObject: function (o) {
    this.clickable_objects.push(o);
  },

  removeObject: function (o) {
    for (var i = 0; i < this.clickable_objects.length; i++) {
      if (this.clickable_objects[i] == o) {
        this.clickable_objects.splice(i, 1);
        return
      }
    }
    throw "Object not in list"
  },

  activate: function () {
    this.active = true;
  },

  deactivate: function () {
    this.active = false;
  }

};

