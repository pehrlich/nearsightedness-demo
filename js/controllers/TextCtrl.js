function TextCtrl(camera, scene, font) {
  this._segments = [];
  this._animations = [];
  this.camera = camera;
  this.scene = scene;
  this.font = font;
  this.numFound = 0;

  this.createMeshes();
}

TextCtrl.prototype = {
  createMeshes: function () {
    this._segments = [
      {
        string: "My dear, let us hope  ",
        cameraPos: [-1.167, 1.03, -3],
        startPos: [-0.8, 0.1, -0.4],
        startScale: 0.7
      },
      {
        string: "it is not true;",
        cameraPos: [-0.15, 1.03, -3],
        startPos: [-2, 0.6, -1.6],
        startScale: 0.7
      },
      {
        string: "but, if it is true,",
        cameraPos: [0.47, 1.03, -3],
        startPos: [2.3, 1.5, -2],
        startScale: 0.7
      },
      {
        string: "let us hope it will not become generally known.",
        cameraPos: ['center', 0.9, -3],
        startPos: [-0.5, 0.5, -2.64],
        startScale: 0.7
      }
    ];

    var ctrl = this;

    var onTextMouseOver = function (event) {
      this.userData.origColor0 = this.material.materials[0].color.getHex();
      this.userData.origColor1 = this.material.materials[1].color.getHex();
      this.material.materials[0].color.setHex(0xf4f442);
    };

    var onTextMouseOut = function (event) {
      this.material.materials[0].color.setHex(this.userData.origColor0);
    };

    var onTextClick = function (event) {
      var segment = this.userData.segment;
      var finalPosition = new THREE.Vector3().fromArray(segment.cameraPos);
      ctrl.camera.updateMatrixWorld(true);
      finalPosition.applyMatrix4(ctrl.camera.matrixWorld);

      ctrl.animate(segment.mesh, finalPosition).then(function (mesh) {
        THREE.SceneUtils.detach(mesh, ctrl.scene, ctrl.camera);
        mesh.position.fromArray(mesh.userData.segment.cameraPos);
        ctrl.numFound++;
        if (ctrl.numFound === 4) {
          var signature = ctrl._createText(
            "...Spoken in the 1880s, by the Bishop of Birmingham’s\n wife when she heard that Charles Darwin was claiming\n that human beings were descended from the apes.",
            {}
          );
          signature.scale.multiplyScalar(0.8);
          signature.position.set(-1,0.6,-3);
          segment.mesh.lookAt(ctrl.camera);
          ctrl.camera.add(signature);
        }
      } );

    };


    var segment;

    for (var i = 0; i < this._segments.length; i++) {
      segment = this._segments[i];

      segment.mesh = this._createText(segment.string, segment.geometryOptions);
      segment.mesh.userData.segment = segment;

      // replace template:
      if (segment.cameraPos[0] == 'center') {
        segment.cameraPos[0] = -0.5 * ( segment.mesh.geometry.boundingBox.max.x - segment.mesh.geometry.boundingBox.min.x );
      }

      segment.mesh.addEventListener('mouseover', onTextMouseOver);
      segment.mesh.addEventListener('mouseout', onTextMouseOut);
      segment.mesh.addEventListener('click', onTextClick);

      if (segment.startScale) segment.mesh.scale.multiplyScalar(segment.startScale);

      if (segment.startPos) {
        segment.mesh.position.fromArray(segment.startPos);
        this.scene.add(segment.mesh);
        segment.mesh.lookAt(this.camera);
      } else {
        segment.mesh.position.fromArray(segment.cameraPos);
        this.camera.add(segment.mesh);
        segment.mesh.lookAt(this.camera);
      }

    }

  },

  _createText: function (string, options) {
    var size = 0.08;
    var height = 0.07;
    var curveSegments = 2;

    var geometryOptions = {
      font: this.font, size: size, height: height, curveSegments: curveSegments
    };
    Object.assign(geometryOptions, options);

    var material = new THREE.MultiMaterial([
      new THREE.MeshBasicMaterial({color: 0xffffff, overdraw: 0.5}),
      new THREE.MeshBasicMaterial({color: 0x000000, overdraw: 0.5})
    ]);

    var geometry = new THREE.TextGeometry(string, geometryOptions);
    geometry.computeBoundingBox();

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = string.slice(0, 10) + '...';

    return mesh
  },

  meshes: function () {
    return this._segments.map(function (segment) {
      return segment.mesh
    })
  },

  // fixed duration of 1s
  animate: function (mesh, endPos) {
    var o = {
      startTime: performance.now(),
      endTime: performance.now() + 1000,
      target: mesh,
      startPos: mesh.position.clone(),
      endPos: endPos,
      resolve: null,
      reject: null
    };

    var p = new Promise(function (resolve, reject) {
      o.resolve = resolve;
      o.reject = reject;
    });

    this._animations.push(o);
    return p;
  },


  update: function (timestamp) {

    var animation;
    for (var i = 0; i < this._animations.length; i++) {
      animation = this._animations[i];

      var t = (timestamp - animation.startTime) / (animation.endTime - animation.startTime);
      if (t > 1) {
        this._animations.splice(i, 1);
        i--;
        animation.resolve(animation.target);
      } else {
        animation.target.position.set(0, 0, 0)
          .add(animation.endPos).sub(animation.startPos).multiplyScalar(t)
          .add(animation.startPos);
        animation.target.scale.set(1, 1, 1).multiplyScalar(t);
      }
    }

  }


};