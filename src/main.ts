import {
  AmbientLight,
  CircleGeometry,
  DirectionalLight,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import './style.css';
import { generateCurve } from './TestCurve';

function setupCanvas() {
  const canvas = document.getElementById('render-screen') as HTMLCanvasElement;
  const renderer = new WebGLRenderer({
    antialias: false,
    canvas,
    alpha: true,
  });

  // Human FOV = 120 deg
  const camera = new PerspectiveCamera(75);
  camera.far = 600;
  handleResponsiveCamera(renderer, camera);
  camera.position.y = 100;

  const scene = new Scene();
  const light = new AmbientLight(0xffffff, 1);
  scene.add(light);

  const secondaryLight = new DirectionalLight(0xeeeeff, 2);
  secondaryLight.position.set(0, 800, 0);
  scene.add(secondaryLight);

  renderStagePlane(scene);
  renderSphere(scene);
  renderSphere(scene, 10);

  renderer.render(scene, camera);

  setupAnimationLoop(renderer, scene, camera);
}

function renderSphere(scene: Scene, radius: number = 5) {
  const sphereGeometry = new SphereGeometry(radius);
  const sphereMaterial = new MeshPhongMaterial({
    color: 0x000000,
  });
  const sphere = new Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);
}

function renderStagePlane(scene: Scene) {
  const planeGeometry = new CircleGeometry(400, 400);
  planeGeometry.rotateX(-Math.PI / 2);

  const material = new MeshPhongMaterial({
    color: 0x090911,
  });

  const plane = new Mesh(planeGeometry, material);
  scene.add(plane);
}

function setupAnimationLoop(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera
) {
  const rotationPerSeccond = (1 / 4) * Math.PI;
  const cameraRotationRadius = 200;
  let lastCurve: Mesh | undefined;

  const render = (tiemstamp: number) => {
    const timeSecconds = tiemstamp * 0.001;
    const currentAngle = rotationPerSeccond * timeSecconds;

    camera.position.x = cameraRotationRadius * Math.cos(currentAngle);
    camera.position.z = cameraRotationRadius * Math.sin(currentAngle);
    camera.lookAt(0, 100, 0);

    if (lastCurve !== undefined) scene.remove(lastCurve);
    lastCurve = generateCurve(scene);

    renderer.render(scene, camera);

    handleResponsiveCamera(renderer, camera);
    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);
}

function handleResponsiveCamera(
  renderer: WebGLRenderer,
  camera: PerspectiveCamera
) {
  const { width, height, clientWidth, clientHeight } = renderer.domElement;

  if (width !== clientWidth || height !== clientHeight) {
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
}

setupCanvas();
