import {
  AmbientLight,
  CircleGeometry,
  DirectionalLight,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import './style.css';
import { createRandomPoints, generateCurve } from './TestCurve';

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
  const sphereGeometry = new IcosahedronGeometry(radius);
  const sphereMaterial = new MeshPhongMaterial({
    color: 0x341812,
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
  const rotationPerSecond = (1 / 4) * Math.PI;
  const cameraRotationRadius = 200;
  let lastTimestamp = 0;
  const segments = 50;
  const amplitude = 5;
  const branchVlength = 4;
  const branchSegmentsPerMs = 50 / 1000;

  let currentSegment = 0;
  let branchPoints = createRandomPoints(amplitude, segments);

  const render = (timestamp: number) => {
    const renderDeltaMs = timestamp - lastTimestamp;
    const branchDelta = branchSegmentsPerMs * renderDeltaMs;

    const timeSeconds = timestamp * 0.001;
    const currentAngle = rotationPerSecond * timeSeconds;

    camera.position.x = cameraRotationRadius * Math.cos(currentAngle);
    camera.position.z = cameraRotationRadius * Math.sin(currentAngle);
    camera.lookAt(0, 100, 0);

    const animationObjects = new Group();

    const drawableBranch = branchPoints.slice(0, currentSegment);

    if (drawableBranch.length !== 0) {
      generateCurve(
        animationObjects,
        drawableBranch,
        drawableBranch.length * branchVlength
      );
    } else {
      branchPoints = createRandomPoints(amplitude, segments);
    }

    scene.add(animationObjects);
    handleResponsiveCamera(renderer, camera);
    renderer.render(scene, camera);

    if (Math.floor(renderDeltaMs) > 16) {
      console.log(`Lag spike, frame took: ${renderDeltaMs} ms`);
    }

    requestAnimationFrame((t) => {
      currentSegment = (currentSegment + branchDelta) % branchPoints.length;
      lastTimestamp = timestamp;
      scene.remove(animationObjects);
      render(t);
    });
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
