import {
  AmbientLight,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import './style.css';
import { createRandomPoints, generateCurve } from './GeometryMeshes/CustomCurve';
import { buildOriginStone } from './GeometryMeshes/OriginStone';
import { buildStagePlane } from './GeometryMeshes/StagePlane';
import { LichtenbergTree } from './Structures/LichtenbergTree';
import { buildLichtenbergTreeMesh } from './GeometryMeshes/LichtenbergTree';
import { doNTimes } from './utils/misc';

const STRUCT_ORIGIN = new Vector3(0, 5, 0);

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

  // Ambient light and directional light
  const scene = new Scene();
  const light = new AmbientLight(0xffffff, 1);
  scene.add(light);

  const secondaryLight = new DirectionalLight(0xeeeeff, 2);
  secondaryLight.position.set(0, 800, 0);
  scene.add(secondaryLight);

  // Origin stone and stage plane
  const originStone = buildOriginStone(5);
  scene.add(originStone);

  originStone.position.copy(STRUCT_ORIGIN);

  const plane = buildStagePlane();
  scene.add(plane);

  // First draw
  renderer.render(scene, camera);

  // setupSingleBranchAnimationLoop(renderer, scene, camera);
  setupLichtenbergAnimationLoop(renderer, scene, camera);
}

export function setupSingleBranchAnimationLoop(
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



function setupLichtenbergAnimationLoop(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera
) {
  const rotationPerSecond = (1 / 8) * Math.PI;
  const cameraRotationRadius = 200;
  let lastTimestamp = 0;

  const startTree = () => new LichtenbergTree(STRUCT_ORIGIN, {
    growthRate: { min: 1, max: 15 }, // Random growth between 2 and 5 units
    spreadRange: 5,
    branchFactor: 0.05,
    maxChildBranches: 3,
  });

  const maxLayerCount = 80;
  let layerCount = 0;
  // Layers per ms
  const growthSpeed = 30 / 1000; // 2 layers per second
  let timeAccumulator = 0;

  let tree = startTree();

  const render = (timestamp: number) => {
    const timeSeconds = timestamp * 0.001;
    const renderDeltaMs = timestamp - lastTimestamp;
    const currentAngle = rotationPerSecond * timeSeconds;

    camera.position.x = cameraRotationRadius * Math.cos(currentAngle);
    camera.position.z = cameraRotationRadius * Math.sin(currentAngle);
    camera.lookAt(0, 100, 0);

    handleResponsiveCamera(renderer, camera);

    const layersToAdd = Math.floor(growthSpeed * (renderDeltaMs + timeAccumulator));

    if (layersToAdd === 0) {
      timeAccumulator += renderDeltaMs;
    } else {
      timeAccumulator = 0;
    }

    doNTimes(layersToAdd, () => {
      if (layerCount < maxLayerCount) {
        tree.growTreeLayer();
        layerCount++;
      } else {
        tree = startTree();
        layerCount = 0;
      }
    });

    const { group: treeMeshGroup, cleanup } = buildLichtenbergTreeMesh(tree);

    scene.add(treeMeshGroup);
    renderer.render(scene, camera);

    if (renderDeltaMs > 16) {
      console.debug(`Lag spike, frame took: ${renderDeltaMs} ms`);

      if (layerCount > 10) {
        console.warn("Frame took too long, resetting tree and layer count");
        tree = startTree();
        layerCount = 0;
      }
    }

    requestAnimationFrame((t) => {
      lastTimestamp = timestamp;
      scene.remove(treeMeshGroup);
      cleanup();
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
