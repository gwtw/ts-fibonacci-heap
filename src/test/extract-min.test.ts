import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('extractMin', () => {
  it('extract-min should return undefined on an empty heap', () => {
    const heap = new TestFibonacciHeap();
    assert.equal(heap.extractMinimum(), null);
  });

  it('should extract the minimum item from a heap', () => {
    const heap = new TestFibonacciHeap();
    const node5 = heap.insert(5);
    const node3 = heap.insert(3);
    const node4 = heap.insert(4);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
  });

  it('should extract the minimum item from a jumbled heap', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(1);
    const node4 = heap.insert(4);
    const node3 = heap.insert(3);
    const node5 = heap.insert(5);
    const node2 = heap.insert(2);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
  });

  it('should extract the minimum item from a heap containing negative items', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(-9);
    const node4 = heap.insert(6);
    const node3 = heap.insert(3);
    const node5 = heap.insert(10);
    const node2 = heap.insert(-4);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
  });

  it('should consolidate 8 nodes into a well formed order 1 tree', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);

    // Extracting minimum should trigger consolidate.
    //
    //               1
    //  0--1--2  ->  |
    //               2
    //
    assert.equal(heap.extractMinimum(), node0);
    assert.equal(heap.size(), 2);
    assert.isTrue(node1.parent === null);
    assert.isTrue(node2.parent === node1);
    assert.isTrue(node1.next === node1);
    assert.isTrue(node2.next === node2);
    assert.isTrue(node1.child === node2);
    assert.isTrue(node2.child === null);
  });

  it('should consolidate 8 nodes into a well formed order 2 tree', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    const node3 = heap.insert(3);
    const node4 = heap.insert(4);

    // Extracting minimum should trigger consolidate.
    //
    //                       1
    //                      /|
    //  0--1--2--3--4  ->  3 2
    //                     |
    //                     4
    //
    assert.equal(heap.extractMinimum(), node0);
    assert.equal(heap.size(), 4);
    assert.isTrue(node1.parent === null);
    assert.isTrue(node2.parent === node1);
    assert.isTrue(node3.parent === node1);
    assert.isTrue(node4.parent === node3);
    assert.isTrue(node1.next === node1);
    assert.isTrue(node2.next === node3);
    assert.isTrue(node3.next === node2);
    assert.isTrue(node4.next === node4);
    assert.isTrue(node1.child === node2);
    assert.isTrue(node2.child === null);
    assert.isTrue(node3.child === node4);
    assert.isTrue(node4.child === null);
  });

  it('should consolidate 8 nodes into a well formed order 3 tree', () => {
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
    //                                 __1
    //                                / /|
    //                               5 3 2
    //  1--2--3--4--5--6--7--8  ->  /| |
    //                             7 6 4
    //                             |
    //                             8
    //
    assert.equal(heap.extractMinimum(), node0);
    assert.isTrue(node1.parent === null);
    assert.isTrue(node2.parent === node1);
    assert.isTrue(node3.parent === node1);
    assert.isTrue(node4.parent === node3);
    assert.isTrue(node5.parent === node1);
    assert.isTrue(node6.parent === node5);
    assert.isTrue(node7.parent === node5);
    assert.isTrue(node8.parent === node7);
    assert.isTrue(node1.next === node1);
    assert.isTrue(node2.next === node5);
    assert.isTrue(node3.next === node2);
    assert.isTrue(node4.next === node4);
    assert.isTrue(node5.next === node3);
    assert.isTrue(node6.next === node7);
    assert.isTrue(node7.next === node6);
    assert.isTrue(node8.next === node8);
    assert.isTrue(node1.child === node2);
    assert.isTrue(node2.child === null);
    assert.isTrue(node3.child === node4);
    assert.isTrue(node4.child === null);
    assert.isTrue(node5.child === node6);
    assert.isTrue(node6.child === null);
    assert.isTrue(node7.child === node8);
    assert.isTrue(node8.child === null);
  });

  it('should consolidate after extract min is called on a tree with a single tree in the root node list', () => {
    const heap = new TestFibonacciHeap();
    const node0 = heap.insert(0);
    const node1 = heap.insert(1);
    const node2 = heap.insert(2);
    const node3 = heap.insert(3);
    heap.insert(4);
    heap.insert(5);
    heap.insert(6);
    heap.insert(7);
    heap.insert(8);

    // Extract minimum to trigger a consolidate nodes into a single Fibonacci tree.
    //
    //                                 __1
    //                                / /|
    //                               2 c d
    //  1--2--3--4--5--6--7--8  ->  /| |
    //                             a b f
    //                             |
    //                             e
    //
    assert.equal(heap.extractMinimum(), node0);

    // Delete the 2nd smallest node in the heap which is the child of the single node in the root
    // list. After this operation is performed the minimum node (1) is no longer pointing the minimum
    // child in the node list!
    //
    //      __1
    //     / /|         __1
    //    2 c d        / /|  Note that a in this illustration could also be b, the main thing
    //   /| |    ->   a c d  to take note of here is that a (or b) may not be the minimum child
    //  a b f        /| |    of 1 anymore, despite being the node it's linked to.
    //  |           e b f
    //  e
    //
    heap.delete(node2);

    // Extracting the minimum node at this point must trigger a consolidate on the new list, otherwise
    // the next minimum may not be the actual minimum.
    //
    //
    //      __1
    //     / /|       a---c---d
    //    a c d  ->  /|   |      -> Consolidate now to ensure the heap's minimum is correct
    //   /| |       e b   f
    //  e b f
    //
    //
    assert.equal(heap.extractMinimum(), node1);
    assert.equal(heap.findMinimum(), node3);
  });
});
