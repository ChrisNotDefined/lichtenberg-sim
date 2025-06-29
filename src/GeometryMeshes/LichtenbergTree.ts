import { CatmullRomCurve3, Group, Mesh, PointLight, TubeGeometry, Vector3 } from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { LichtenbergTree, TreeNode } from "../Structures/LichtenbergTree";
import { LightningMaterial } from "../ObjectMaterials/LightningMaterial";

const buildTipLight = (location: Vector3) => {
  const light = new PointLight(LightningMaterial.color, location.y * 0.03);
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

  const geometries: TubeGeometry[] = [];

  for (const path of paths) {
    const curve = new CatmullRomCurve3(path)
    const tubeGeometry = new TubeGeometry(curve, path.length * 5, 0.5, 8, false);
    geometries.push(tubeGeometry);
  }

  if (geometries.length > 0) {
    let mergedBranches = BufferGeometryUtils.mergeBufferGeometries(geometries, false);
    mergedBranches = BufferGeometryUtils.mergeVertices(mergedBranches);

    const treeMesh = new Mesh(mergedBranches, LightningMaterial);
    group.add(treeMesh);
  }

  const nodeLocationAccumulator = new Vector3(0, 0, 0);
  let nodeCount = 0;

  tree.branchTips.forEach((node) => {
    nodeCount++;
    nodeLocationAccumulator.add(node.location);
  })

  const averageLocation = nodeLocationAccumulator.divideScalar(nodeCount);

  const light = buildTipLight(averageLocation);
  group.add(light);

  const cleanup = () => {
    group.children.forEach((child) => {
      if (child instanceof Mesh) {
        child.geometry.dispose();
      } else if (child instanceof PointLight) {
        child.dispose();
      }
    });

    geometries.forEach((geometry) => {
      geometry.dispose();
    });
  }

  return {
    group,
    cleanup
  }
} 