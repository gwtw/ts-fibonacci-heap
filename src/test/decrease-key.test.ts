import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('decreaseKey', () => {
  it('should throw an exception given a non-existent node', () => {
    const heap = new TestFibonacciHeap();
    assert.throws(() => {
      heap.decreaseKey(<any>undefined, 2);
    });
  });

  it('should throw an exception given a new key larger than the old key', () => {
    const heap = new TestFibonacciHeap();
    assert.throws(() => {
      const node = heap.insert(1);
      heap.decreaseKey(node, 2);
    });
  });

  it('should decrease the minimum node', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(1);
    heap.insert(2);
    heap.decreaseKey(node1, -3);
    const key = heap.findMinimumUnsafe().key;
    assert.deepEqual(key, node1.key);
    assert.equal(key, -3);
  });

  it('should decrease and bubble up a non-minimum node', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(1);
    const node2 = heap.insert(2);
    heap.decreaseKey(node2, -3);
    const key = heap.findMinimumUnsafe().key;
    assert.deepEqual(key, node2.key);
    assert.equal(key, -3);
  });

  it('should decrease and bubble up a non-minimum node in a large heap', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(13);
    heap.insert(26);
    heap.insert(3);
    heap.insert(-6);
    const node5 = heap.insert(27);
    heap.insert(88);
    heap.insert(59);
    heap.insert(-10);
    heap.insert(16);
    heap.decreaseKey(node5, -11);
    assert.deepEqual(heap.findMinimumUnsafe().key, node5.key);
  });

  it('should leave a valid tree on a flat Fibonacci heap', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(13);
    heap.insert(26);
    heap.insert(3);
    heap.insert(-6);
    heap.insert(27);
    const node6 = heap.insert(88);
    heap.insert(59);
    heap.insert(-10);
    heap.insert(16);
    heap.decreaseKey(node6, -8);
    assert.deepEqual(heap.extractMinimumUnsafe().key, -10);
    assert.deepEqual(heap.extractMinimumUnsafe().key, -8);
    assert.deepEqual(heap.extractMinimumUnsafe().key, -6);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 3);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 13);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 16);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 26);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 27);
    assert.deepEqual(heap.extractMinimumUnsafe().key, 59);
  });

  it('should leave a valid tree on a consolidated Fibonacci heap', () => {
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

    // Decrease node 8 to 0
    //
    //      __1
    //     / /|        __1--0
    //    5 3 2       / /|
    //   /| |    ->  5 3 2
    //  7 6 4       /| |
    //  |          7 6 4
    //  8
    //
    heap.decreaseKey(node8, 0);
    assert.isTrue(node1.next === node8);

    assert.equal(heap.size(), 8);
    assert.isTrue(heap.extractMinimum() === node8);
    assert.isTrue(heap.extractMinimum() === node1);
    assert.isTrue(heap.extractMinimum() === node2);
    assert.isTrue(heap.extractMinimum() === node3);
    assert.isTrue(heap.extractMinimum() === node4);
    assert.isTrue(heap.extractMinimum() === node5);
    assert.isTrue(heap.extractMinimum() === node6);
    assert.isTrue(heap.extractMinimum() === node7);
    assert.isTrue(heap.isEmpty());
  });

  it('should delete the node\'s parent reference after a cut', () => {
    const heap = new TestFibonacciHeap();
    const node1 = heap.insert(1);
    heap.insert(2);
    const node3 = heap.insert(3);
    assert.equal(heap.size(), 3);

    // Trigger a consolidate
    //
    //               2
    //  1--2--3  ->  |
    //               3
    //
    assert.equal(heap.extractMinimum(), node1);

    // Decrease 3's key such that it's less than its parent
    //
    //  2      1
    //  |  ->  |
    //  3      2
    //
    heap.decreaseKey(node3, 1);

    // Ensure 1's parent is null (the link to 2 has been cut)
    assert.equal(node3.parent, null);
  });
});
