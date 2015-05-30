var Base = require('animator3d/Base');
var Controls = require('./Trackball');
var LoopManager = require('animator3d/LoopManager');
var THREE = require('three');

var ThreeBase = Base.extend({ 
  _container: undefined,
  _trackball: true,
  _rendererOpts: {
    antialias: true
  },

  constructor: function ThreeBase (options) {
    this.callSuper(Base, 'constructor', options);

    this._scene = new THREE.Scene();
    this._renderer = new THREE.WebGLRenderer(this._rendererOpts);
    this._controls;
    this._size = [];
    this._readContainerSize();

    this.boundResize = this._onResize.bind(this);
    this.boundAnimate = this._animate.bind(this);

    window.addEventListener('resize', this.boundResize);
    LoopManager.on('postLoop', this.boundAnimate);

    this._container = options.element || document.body;

    this._createCamera();
    this._createTrackball();
    this._onResize();
    this._container.appendChild(this._renderer.domElement);
  },

  /**
   *  Creates camera (required) & trackball controls (optional).
   */
  _createCamera: function () {
    var size = this.getContainerSize();
    this._camera = new THREE.PerspectiveCamera( 30, size[0] / size[1] , 1, 3500);
    this._camera.position.z = -1500;
    this._camera.lookAt( this._scene.position );
  },
  _createTrackball: function () {
    if (this._trackball) {
      this._controls = new THREE.TrackballControls(this._camera);

      this._controls.rotateSpeed = 1.0;
      this._controls.zoomSpeed = 1.2;
      this._controls.panSpeed = 0.8;

      this._controls.staticMoving = false;
      this._controls.dynamicDampingFactor = 0.1;

      this._controls.keys = [ 65, 83, 68 ];
    }
  },

  add: function () {
    this._scene.add.apply(this._scene, arguments);
  },
  _readContainerSize: function () {
    this._size[0] = this._element.clientWidth; 
    this._size[1] = this._element.clientHeight;
  },
  _onResize: function () {
    this._readContainerSize();
    var size = this.getContainerSize();
    this._renderer.setSize(size[0], size[1]);

    this._syncCamera(this._camera);

    if (this._trackball) this._controls.handleResize();
    return size;
  },
  _syncCamera: function (camera) {
    var size = this.getContainerSize();
    camera.aspect = size[0] / size[1];
    camera.updateProjectionMatrix()
  },
  update: function () {},

  getContainerSize: function () {
    return this._size;
  },

  destroy: function () {
    if (this._trackball) {
      this._controls.unbind();
    }
    LoopManager.unbind('postLoop', this.boundAnimate);
    window.removeEventListener('resize', this.boundResize);
    cleanupThree(this._scene);
  },

  _animate: function () {
    if (this._trackball) {
        this._controls.update();
    }
    this.update();
    this.render();
  },
  render: function () {
    this._renderer.render(this._scene, this._camera);
  }
});

function cleanupThree(obj) {
  if (obj !== null) {
    for (var i = 0; i < obj.children.length; i++) {
      cleanupThree(obj.children[i]);
    }
    if (obj.geometry) {
        obj.geometry.dispose();
        obj.geometry = undefined;
    }
    if (obj.material) {
      if (obj.material.materials) {
        for (i = 0; i < obj.material.materials.length; i++) {
          obj.material.materials[i].dispose();
         }
      } else {
        obj.material.dispose();
      }
      obj.material = undefined;
    }
    if (obj.texture) {
      obj.texture.dispose();
      obj.texture = undefined;
    }
  }
  obj = undefined;
}

module.exports = ThreeBase;
