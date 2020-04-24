var camera, scene, renderer;
var geometry, material, mesh, material2, cube1, cube2;
var selectedObject = [];


init();
animate();

function init() {

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 5000);
  camera.rotation.y = 45/180 * Math.PI;
  camera.position.x = 300;
  camera.position.y = 100;
  camera.position.z = 100;

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.addEventListener('change', renderer);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  //LIGHTS
  hlight = new THREE.AmbientLight(0x404040,5);
  scene.add(hlight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight.position.set(0,500,0);
  scene.add(directionalLight);

  light1 = new THREE.DirectionalLight(0xc4c4c4, 4);
  light1.position.set(0,300,500);
  scene.add(light1);

  light2 = new THREE.DirectionalLight(0xc4c4c4, 4);
  light2.position.set(500,100,0);
  scene.add(light2);

  light3 = new THREE.DirectionalLight(0xc4c4c4, 4);
  light3.position.set(0,100,-500);
  scene.add(light3);

  light4 = new THREE.DirectionalLight(0xc4c4c4, 4);
  light4.position.set(-500,300,0);
  scene.add(light4);

  //LOADER

  let loader = new THREE.GLTFLoader();
  loader.load('model/motorino.glb', function(gltf) {
    ahu = gltf.scene.children[0];
    material = new THREE.MeshPhongMaterial({
      color: 0x0093dd,
      transparent: true,
      opacity: 0.2
    });
    ahu.material = material;
    scene.add(ahu)
    ahu.scale.set(100,100,100);
    selectedObject.push(scene.children[6]);

    animate();
  });

  composer = new THREE.EffectComposer(renderer);
  var renderPass = new THREE.RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);

  outlinePass.edgeStrength = Number(30);
  outlinePass.edgeGlow = Number(0);
  outlinePass.edgeThickness = Number(0.5);
  outlinePass.pulsePeriod = Number(0);
  outlinePass.visibleEdgeColor.set("#aa0400");
  outlinePass.hiddenEdgeColor.set("#000000");
  outlinePass.selectedObjects = selectedObject;
  outlinePass.downSampleRatio = 1;
  composer.addPass(outlinePass);

  effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
  effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
  effectFXAA.renderToScreen = true;
  composer.addPass(effectFXAA);
  composer.addPass(outlinePass);


  document.body.appendChild(renderer.domElement);

}

function animate() {

  requestAnimationFrame(animate);

  composer.render();

}
