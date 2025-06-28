import { CatmullRomCurve3, Group, Mesh, MeshPhongMaterial, PointLight, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { LichtenbergTree, TreeNode } from "../Structures/LichtenbergTree";
import { LightningMaterial } from "../Materials/LightningMaterial";

const buildTipLight = (location: Vector3) => {
  const light = new PointLight(LightningMaterial.color, 5);
  light.position.copy(location);
  return light;
}

export const buildLichtenbergTreeMesh = (tree: LichtenbergTree) => {
  const paths: Vector3[][] = [];
  let workingPath: Vector3[];

  const startPath = (node: TreeNode) => {
    workingPath = [node.location];
  }

  const addToPath = (node: TreeNode) => {
    workingPath.push(node.location);
  }

  const endPath = (node: TreeNode) => {
    workingPath.push(node.location);
    paths.push(workingPath);
  }

  tree.depthTraverse(startPath, addToPath, endPath);

  const group = new Group();

  for (const path of paths) {
    const curve = new CatmullRomCurve3(path)
    const cilinder = new TubeGeometry(curve, path.length * 5, 0.5, 8, false);
    const mesh = new Mesh(cilinder, LightningMaterial);
    group.add(mesh);
  }

  const nodeLocationAccumulator = new Vector3(0, 0, 0);
  let nodeCount = 0;

  tree.branchTips.forEach((node) => {
    nodeCount++;
    nodeLocationAccumulator.add(node.location);
  })

  const averageLocation = nodeLocationAccumulator.divideScalar(nodeCount);

  const sphere = new SphereGeometry(5);
  const averageSphere = new Mesh(sphere, new MeshPhongMaterial({
    color: 0xFF0000,
    emissive: 0xFF0000,
    emissiveIntensity: 1
  }));

  averageSphere.position.copy(averageLocation);
  const light = buildTipLight(averageLocation);
  // group.add(averageSphere);
  group.add(light);

  return {
    group
  }
} 