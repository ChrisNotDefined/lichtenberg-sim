import * as THREE from 'three';
import './style.css';

function setupCanvas() {
  const canvas = document.getElementById('render-screen') as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas,
    alpha: true,
  });

  console.log(canvas);
}

function animationLoop(canvas: HTMLCanvasElement) {}

function handleResponsiveCamera(
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera
) {
  const { width, height, clientWidth, clientHeight } = canvas;

  
}

setupCanvas();
