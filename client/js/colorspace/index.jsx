var THREE = require('three');
var Base = require('animator3d/Base');
var ThreeBase = require('../threex/ThreeBase');

var colorCount = Math.floor(255 / 10);

function cubeBuilder (sideLength, sideWidth, length) {
  var step = sideWidth / sideLength;
  var indices = 1 / length;
  var yStep = 0;
  var zStep = 0;
  var half = -sideWidth * 0.5;

  var vec = new THREE.Vector3();
  
  function vert (v, i) {
    if (i % sideLength == 0 && i !== 0) {
      yStep++;
      console.log(yStep, sideLength);
      if (yStep % sideLength == 0) {
        yStep = 0;
        zStep++;
        if (zStep > sideLength) {
          debugger;
        }
      }
    }
    var x = (i % sideLength) * step + half;
    var y = yStep * step + half;
    var z = zStep * step + half;
    v.set(x, y, z);
  }

  function color (i) {
    vert(vec, i);
    vec.x -= half;
    vec.y -= half;
    vec.z -= half;
    //console.log(vec.toArray());
    return 0x000000;
    
  }

  return {
    vert: vert,
    color: color
  }
};

var Color = ThreeBase.extend({ 
  _element: document.getElementById('application'),
  _pointLimit: Math.pow(colorCount, 3),
  constructor (options) {
    this.callSuper(ThreeBase, 'constructor', options);
    this.placeDots();
    this._renderer.setClearColor(0xffffff)
  },
  placeDots () {
    var geo = new THREE.Geometry();
    var mat = new THREE.PointCloudMaterial({
      vertexColors: THREE.VertexColors,
      size: 20,
      side: THREE.DoubleSide
    });

    var cube = cubeBuilder(colorCount, 200, this._pointLimit);
  
    for (var i = 0; i < this._pointLimit; i++) { 
      var v = new THREE.Vector3();
      cube.vert(v, i);
      geo.vertices.push(v);
      var c = color * i;

      geo.colors.push(
        new THREE.Color(
          cube.color(i)
        )
      )
    }

    var mesh = new THREE.PointCloud(geo, mat);
    console.log(mesh);
    this._scene.add(mesh);
  }
});

var color = new Color();
