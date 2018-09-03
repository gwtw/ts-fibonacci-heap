import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('delete', () => {
  it('should delete the head of the heap', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    heap.delete(node1);
    assert.equal(heap.extractMinimum(), node2);
    assert.isTrue(heap.isEmpty());
  });

  it('should delete nodes in a heap with multiple elements', () => {
    const heap = new TestFibonacciHeap();
    const node3 = heap.insert(13);
    const node4 = heap.insert(26);
    const node2 = heap.insert(3);
    const node1 = heap.insert(-6);
    const node5 = heap.insert(27);
    assert.equal(heap.size(), 5);
    assert.equal(heap.extractMinimum(), node1);
    assert.equal(heap.extractMinimum(), node2);
    assert.equal(heap.extractMinimum(), node3);
    assert.equal(heap.extractMinimum(), node4);
    assert.equal(heap.extractMinimum(), node5);
    assert.isTrue(heap.isEmpty());
  });

  it('should delete nodes in a flat Fibonacci heap', () => {
    const heap = new TestFibonacciHeap();
    const node3 = heap.insert(13);
    const node4 = heap.insert(26);
    const node2 = heap.insert(3);
    const node1 = heap.insert(-6);
    const node5 = heap.insert(27);
    assert.equal(heap.size(), 5);
    heap.delete(node3);
    assert.equal(heap.size(), 4);
    assert.equal(heap.extractMinimum(), node1);
    assert.equal(heap.extractMinimum(), node2);
    assert.equal(heap.extractMinimum(), node4);
    assert.equal(heap.extractMinimum(), node5);
    assert.isTrue(heap.isEmpty());
  });

  it('should cut the node from the tree if the node is not the minimum it does not have a grandparent', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    const node3 = heap.insert(3);
    const node4 = heap.insert(4);
    // Extract the minimum, forcing the construction of an order 2 tree which
    // is changed to an order 0 and order 1 tree after the minimum is extracted.
    //
    //                    1
    //                   /|      3--2
    //  1--2--3--4  ->  3 2  ->  |
    //                  |        4
    //                  4
    //
    assert.equal(heap.extractMinimum(), node1);
    // Deleting the node should trigger a cut and cascadingCut on the heap.
    heap.delete(node4);

    assert.equal(heap.size(), 2);
    assert.equal(heap.extractMinimum(), node2);
    assert.equal(heap.extractMinimum(), node3);
    assert.isTrue(heap.isEmpty());
  });

  it('should cut the node from the tree if the node is not the minimum and it has a grandparent', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    const node3 = heap.insert(3);
    const node4 = heap.insert(4);
    const node5 = heap.insert(5);
    const node6 = heap.insert(6);
    const node7 = heap.insert(7);
    const node8 = heap.insert(8);

    // extractMinimum on 0 should trigger a cut and cascadingCut on the heap.
    //
    //                                    __1
    //                                   / /|
    //                                  5 3 2
    //  0--1--2--3--4--5--6--7--8  ->  /| |
    //                                7 6 4
    //                                |
    //                                8
    //
    assert.equal(heap.extractMinimum(), node0);

    // Delete node 8
    //
    //      __1
    //     / /|        __1
    //    5 3 2       / /|
    //   /| |    ->  5 3 2
    //  7 6 4       /| |
    //  |          7 6 4
    //  8
    //
    heap.delete(node8);

    assert.equal(heap.size(), 7);
    assert.equal(heap.extractMinimum(), node1);
    assert.equal(heap.extractMinimum(), node2);
    assert.equal(heap.extractMinimum(), node3);
    assert.equal(heap.extractMinimum(), node4);
    assert.equal(heap.extractMinimum(), node5);
    assert.equal(heap.extractMinimum(), node6);
    assert.equal(heap.extractMinimum(), node7);
    assert.isTrue(heap.isEmpty());
  });

  it('should cut the node from the tree if the node is not the minimum, it has a grandparent and its parent is marked', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    const node3 = heap.insert(3);
    const node4 = heap.insert(4);
    const node5 = heap.insert(5);
    const node6 = heap.insert(6);
    const node7 = heap.insert(7);
    const node8 = heap.insert(8);

    // Extracting minimum should trigger consolidate.
    //
    //                                    __1
    //                                   / /|
    //                                  5 3 2
    //  0--1--2--3--4--5--6--7--8  ->  /| |
    //                                7 6 4
    //                                |
    //                                8
    //
    assert.equal(heap.extractMinimum(), node0);

    // Delete node 6, marking 5
    //
    //      __1         __1
    //     / /|        / /|
    //    5 3 2      >5 3 2
    //   /| |    ->  /  |
    //  7 6 4       7   4
    //  |           |
    //  8           8
    //
    heap.delete(node6);
    assert.isTrue(node5.isMarked);

    // Delete node 7, cutting the sub-tree
    //
    //      __1
    //     / /|        1--5
    //   >5 3 2       /|  |
    //   /  |    ->  3 2  8
    //  7   4        |
    //  |            4
    //  8
    //
    heap.delete(node7);
    assert.isTrue(node5.next === node1);
    assert.isTrue(node2.next === node3);
    assert.isTrue(node3.next === node2);

    assert.equal(heap.size(), 6);
    assert.isTrue(heap.extractMinimum() === node1);
    assert.isTrue(heap.extractMinimum() === node2);
    assert.isTrue(heap.extractMinimum() === node3);
    assert.isTrue(heap.extractMinimum() === node4);
    assert.isTrue(heap.extractMinimum() === node5);
    assert.isTrue(heap.extractMinimum() === node8);
    assert.isTrue(heap.isEmpty());
  });

  it('should correctly assign an indirect child when a direct child is cut from the parent', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.insert(4);
    const node5 = heap.insert(5);
    const node6 = heap.insert(6);
    const node7 = heap.insert(7);
    heap.insert(8);

    // Extracting minimum should trigger consolidate.
    //
    //                                    __1
    //                                   / /|
    //                                  5 3 2
    //  0--1--2--3--4--5--6--7--8  ->  /| |
    //                                7 6 4
    //                                |
    //                                8
    //
    assert.equal(heap.extractMinimum(), node0);

    // Delete node 6, marking 5
    //
    //      __1         __1
    //     / /|        / /|
    //    5 3 2      >5 3 2
    //   /| |    ->  /  |
    //  7 6 4       7   4
    //  |           |
    //  8           8
    //
    heap.delete(node6);
    assert.isTrue(node5.child === node7);
  });
});
