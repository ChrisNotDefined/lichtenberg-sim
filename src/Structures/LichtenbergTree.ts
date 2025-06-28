import { Vector3 } from "three";
import { randSymmetricInt } from "../utils/math";

export class TreeNode {
  location: Vector3;
  children: TreeNode[];
  parent: TreeNode | undefined;

  constructor(location: Vector3) {
    this.location = location;
    this.children = [];
  }

  branchOutRandChild(spreadRange: number, growLength: number | { min: number, max: number }) {
    const parentLocation = this.location;

    if (typeof growLength === "object") {
      growLength = Math.random() * (growLength.max - growLength.min) + growLength.min;
    }

    const newY = parentLocation.y + growLength;
    const newX = parentLocation.x + randSymmetricInt(spreadRange);
    const newZ = parentLocation.z + randSymmetricInt(spreadRange);

    const childLocation = new Vector3(newX, newY, newZ);
    const newChild = new TreeNode(childLocation);
    newChild.parent = this;
    this.children.push(newChild);

    return newChild;
  }

  addChild(location: Vector3) {
    const child = new TreeNode(location);
    child.parent = this;
    this.children.push(child);

    return child;
  }

  addChildren(...locations: Vector3[]) {
    const newChildren: TreeNode[] = []

    for (const location of locations) {
      const createdNode = this.addChild(location)
      newChildren.push(createdNode);
    }

    return newChildren;
  }
}

type NodeCallback = (node: TreeNode) => void;

/**
 * Configuration options for generating a Lichtenberg tree structure.
 *
 * @property `growthRate` - How far nodes grow upwards from their parent (+y).  
 *   @defaultValue 5
 * @property `spreadRange` - How far nodes can spread horizontally on either side (±x, ±z) from their parent.  
 *   @defaultValue 5
 * @property `branchFactor` - Probability of a branch to create another child.  
 *   @defaultValue 0.5
 * @property `maxChildBranches` - Maximum number of children a branch can create.  
 *   @defaultValue 3
 */
interface LichtenbergTreeConfig {
  /** How far nodes grow upwards from its parent (+y) */
  growthRate: number | { min: number, max: number };

  /** How far nodes can spread horizontally on either side (_+- x, +- Z_) from its parent */
  spreadRange: number;

  /** Probability of a branch to create another child */
  branchFactor: number;

  /** Maximum number of children a branch can create */
  maxChildBranches: number;
}

export class LichtenbergTree {
  root: TreeNode;

  config: LichtenbergTreeConfig = {
    growthRate: 5,
    spreadRange: 5,
    branchFactor: 0.5,
    maxChildBranches: 3,
  };

  branchTips: TreeNode[] = [];

  constructor(rootLocation: Vector3 = new Vector3(0, 0, 0), config?: Partial<LichtenbergTreeConfig>) {
    this.root = new TreeNode(rootLocation);
    this.branchTips.push(this.root);
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  // Animation step
  growTreeLayer() {
    const { growthRate, spreadRange, branchFactor, maxChildBranches } = this.config;
    const newTips: TreeNode[] = []

    for (let tip of this.branchTips) {
      let tipsCreated = 0;

      do {
        // Al least one node for each tip will grow
        const newTip = tip.branchOutRandChild(spreadRange, growthRate);
        newTips.push(newTip);
        tipsCreated++;
      } while (Math.random() < branchFactor && tipsCreated < maxChildBranches);
    }

    this.branchTips = newTips;
  }

  layerTraverse(callback: (node: TreeNode) => void) {
    const queue: TreeNode[] = [this.root];
    while (queue.length > 0) {
      const currentNode = queue.shift();
      if (currentNode) {
        callback(currentNode);
        queue.push(...currentNode.children);
      }
    }
  }

  depthTraverse(onStartPath: NodeCallback, onPathStep: NodeCallback, onEndPath: NodeCallback) {
    const search = (node: TreeNode, pathStarted = false) => {
      let started = pathStarted;

      const parent = node.parent;
      const [firstChild] = node.children;

      if (!started && parent) {
        onStartPath(parent);
        started = true;
      }

      if (!started) {
        onStartPath(node)
        started = true;
      } else if (firstChild) {
        onPathStep(node)
      } else {
        onEndPath(node);
      }

      for (const child of node.children) {
        search(child, started);
        started = false;
      }
    }

    search(this.root);
  }
}
