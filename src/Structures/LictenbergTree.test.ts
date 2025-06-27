import { vi, test, expect } from 'vitest';
import { Vector3 } from "three";
import { LichtenbergTree, TreeNode } from "./LictenbergTree"


/** Returns the hardcoded tree (z is always 0 in this tree and root is at the origin):
 *            *
 *           /|
 * ..........**
 *          / |\
 *          * **
 */
const buildTestTree = () => {
  const tree = new LichtenbergTree(new Vector3(0, 0, 0));

  tree.root.addChildren(
    new Vector3(-1, 1, 0),
    new Vector3(0, 1, 0),
  )

  tree.root.children[0].addChildren(
    new Vector3(-2, 2, 0)
  )

  tree.root.children[1].addChildren(
    new Vector3(0, 2, 0),
    new Vector3(1, 2, 0)
  )

  return tree;
}

test('Depth traverse tree with correct calls', () => {
  const calls: string[] = [];

  const startPath = vi.fn((n: TreeNode) => calls.push(`Start: ${n.location.toArray()}`));
  const endPath = vi.fn((n: TreeNode) => calls.push(`Stop: ${n.location.toArray()}`));
  const stepPath = vi.fn((n: TreeNode) => calls.push(`Step: ${n.location.toArray()}`));

  const tree = buildTestTree();

  tree.depthTraverse(startPath, stepPath, endPath);


  expect(calls).toStrictEqual([
    'Start: 0,0,0',
    'Step: -1,1,0',
    'Stop: -2,2,0',
    'Start: 0,0,0',
    'Step: 0,1,0',
    'Stop: 0,2,0',
    'Start: 0,1,0',
    'Stop: 1,2,0'
  ])
})
