// holds text at the top of the scene attached to the camera
// holds a list of stings
// by default, each string is held in order at the top of the screen
// each string can be given an optional coordinate in world space, and scale, to start at
// when it is "clicked", it will be restored.


function FloatingText(camera, scene, segments) {

  var material = new THREE.MultiMaterial([
    new THREE.MeshBasicMaterial({color: 0xffffff, overdraw: 0.5}),
    new THREE.MeshBasicMaterial({color: 0x000000, overdraw: 0.5})
  ]);

  var loader = new THREE.FontLoader();
  var size = 0.08;
  var height = 0.07;
  var curveSegments = 2;
  var segment;

  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {

    for (var i = 0; i < segments.length; i++) {
      segment = segments[i];
      var geometryOptions = {
        font: font, size: size, height: height, curveSegments: curveSegments
      };
      Object.assign(geometryOptions, segment.geometryOptions);

      var geometry = new THREE.TextGeometry(segment.string, geometryOptions );

      geometry.computeBoundingBox();

      var xOffset;
      if (segment.cameraPos[0] == 'center') {
        xOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
      } else {
        xOffset = segment.cameraPos[0];
      }

      var mesh = new THREE.Mesh(geometry, material);

      mesh.position.set(
        xOffset,
        segment.cameraPos[1],
        segment.cameraPos[2]
      );
      camera.add(mesh);
      mesh.lookAt(camera);
    }
  });

}

FloatingText.prototype = {
  update: function () {

  }
}