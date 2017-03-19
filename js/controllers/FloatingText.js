// holds text at the top of the scene attached to the camera
// holds a list of stings
// by default, each string is held in order at the top of the screen
// each string can be given an optional coordinate in world space, and scale, to start at
// when it is "clicked", it will be restored.


function TextCtrl(camera, scene, font) {
  this._segments = [];
  this._animations = [];
  this.camera = camera;
  this.scene = scene;
  this.font = font;

  this.createMeshes();
}

TextCtrl.prototype = {
  createMeshes: function () {
    this._segments = [
      {
        string: "My dear, let us hope it is not true; but, if it is true, ",
        cameraPos: ['center', 1.03, -3],
        startPos: [0, 0, 0]
      },
      {
        string: "let us hope it will not become generally known.",
        cameraPos: ['center', 0.9, -3]
      }//,
      // {
      //   string: "--Charles Darwin's friend, the wife ",
      //   cameraPos: [0, 0.77, -3],
      //   geometryOptions: {size: 0.05, height: 0.03}
      // },
      // {
      //   string: "  of the Bishop of Birmingham, 1880s.",
      //   cameraPos: [0, 0.67, -3],
      //   geometryOptions: {size: 0.05, height: 0.03}
      // }
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
        THREE.SceneUtils.detach(mesh, this.scene, this.camera);
        mesh.position.fromArray(mesh.userData.segment.cameraPos);
      });
    };


    var size = 0.08;
    var height = 0.07;
    var curveSegments = 2;
    var segment, geometry, material;

    for (var i = 0; i < this._segments.length; i++) {
      segment = this._segments[i];
      var geometryOptions = {
        font: this.font, size: size, height: height, curveSegments: curveSegments
      };
      Object.assign(geometryOptions, segment.geometryOptions);

      material = new THREE.MultiMaterial([
        new THREE.MeshBasicMaterial({color: 0xffffff, overdraw: 0.5}),
        new THREE.MeshBasicMaterial({color: 0x000000, overdraw: 0.5})
      ]);

      geometry = new THREE.TextGeometry(segment.string, geometryOptions);


      geometry.computeBoundingBox();

      // replace template:
      if (segment.cameraPos[0] == 'center') {
        segment.cameraPos[0] = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      }

      segment.mesh = new THREE.Mesh(geometry, material);
      segment.mesh.userData.segment = segment;
      segment.mesh.name = segment.string.slice(0,10) + '...';
      segment.mesh.addEventListener('mouseover', onTextMouseOver);
      segment.mesh.addEventListener('mouseout', onTextMouseOut);
      segment.mesh.addEventListener('click', onTextClick);

      if (segment.startPos) {
        segment.mesh.position.fromArray(segment.startPos);
        this.scene.add(segment.mesh);
        segment.mesh.lookAt(this.camera);
      } else {
        segment.mesh.position.set(
          segment.cameraPos[0],
          segment.cameraPos[1],
          segment.cameraPos[2]
        );
        this.camera.add(segment.mesh);
        segment.mesh.lookAt(this.camera);
      }

    }


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
      }
    }

  }


}