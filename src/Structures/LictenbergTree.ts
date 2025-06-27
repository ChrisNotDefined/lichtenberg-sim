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

  branchOutRandChild(spreadRange: number, growLength: number) {
    const parentLocation = this.location;

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

export class LichtenbergTree {
  root: TreeNode;

  maxBranchLength = 10;

  // How far nodes grow upwards from its parent (+y)
  growthRate = 5;

  /** How far nodes can spread horizontally on either side (_+- x, +- Z_) from its parent */
  spreadRange = 5;

  // Probability of a branch to create another child
  branchFactor = 0.5;

  maxBranchesPerNode = 3;

  branchTips: TreeNode[] = [];

  constructor(rootLocation: Vector3 = new Vector3(0, 0, 0)) {
    this.root = new TreeNode(rootLocation);
    this.branchTips.push(this.root);
  }

  // Animation step
  growTreeLayer() {
    const newTips: TreeNode[] = []

    for (let tip of this.branchTips) {
      let tipsCreated = 0;

      do {
        // Al least one node for each tip will grow
        const newTip = tip.branchOutRandChild(this.spreadRange, this.growthRate);
        newTips.push(newTip);
        tipsCreated++;
      } while (Math.random() < this.branchFactor && tipsCreated < this.maxBranchesPerNode);
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
