var TextureFrag = require('./texture.frag.glsl');
var TextureVert = require('./texture.vert.glsl');
var THREE = require('three');

var FBORenderer = { 
  initFBORenderer: function () {
    this._texture = new THREE.WebGLRenderTarget(this._size[0], this._size[1], { 
      minFilter: THREE.LinearFilter, 
      magFilter: THREE.NearestFilter, 
      format: THREE.RGBAFormat 
    });
  },
  initFBOQuadRenderer: function () {
    this._sceneScreen = new THREE.Scene();
    this._cameraScreen = new THREE.OrthographicCamera(this._size[0] / - 2, this._size[0] / 2, this._size[1] / 2, this._size[1] / - 2, -10000, 10000);

    var plane = new THREE.PlaneBufferGeometry( this._size[0], this._size[1] );
    var material = new THREE.ShaderMaterial({ 
      uniforms: { tDiffuse: { type: "t", value: this._texture } },
      vertexShader: TextureVert,
      fragmentShader: TextureFrag,
      depthWrite: false
    });

    this._screenMesh = new THREE.Mesh(plane, material);
    this._sceneScreen.add(this._screenMesh);
  },

  fboRendererResize: function () {
    if (this._cameraScreen) {
      this._syncCamera(this._cameraScreen);
    }
    if (this._texture) {
      this._texture.dispose();
      this._texture = new THREE.WebGLRenderTarget(this._size[0], this._size[1], { 
        minFilter: THREE.LinearFilter, 
        magFilter: THREE.NearestFilter, 
        format: THREE.RGBAFormat 
      });
    }
  },

  fboRendererRender: function () {
    this._renderer.render(this._scene, this._camera, this._texture, true);
    this._renderer.render(this._scene, this._camera);
  },

  readPixel: function (x, y) {
    var pixels = new Uint8Array(1 * 4);
    this._renderer.readRenderTargetPixels(this._texture, x, y, 1, 1, pixels)
    return pixels;
  },

};

module.exports = FBORenderer;
