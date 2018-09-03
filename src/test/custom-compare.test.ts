import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('customCompare', () => {
  it('should give a min heap given a non-reverse customCompare', () => {
    const heap = new TestFibonacciHeap<number, null>((a, b) => {
      return a.key - b.key;
    });
    const node3 = heap.insert(13);
    const node4 = heap.insert(26);
    const node2 = heap.insert(3);
    const node1 = heap.insert(-6);
    const node5 = heap.insert(27);
    assert.equal(heap.size(), 5);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
    assert.isTrue(heap.isEmpty());
  });

  it('should give a max heap given a reverse customCompare', () => {
    const heap = new TestFibonacciHeap<number, null>((a, b) => {
      return b.key - a.key;
    });
    const node3 = heap.insert(13);
    const node4 = heap.insert(26);
    const node2 = heap.insert(3);
    const node1 = heap.insert(-6);
    const node5 = heap.insert(27);
    assert.equal(heap.size(), 5);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.isTrue(heap.isEmpty());
  });
});
