import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('isEmpty', () => {
  it('should return whether the heap is empty', () => {
    const heap = new TestFibonacciHeap();
    assert.isTrue(heap.isEmpty());
    heap.insert(1);
    assert.isFalse(heap.isEmpty());
    heap.extractMinimum();
    assert.isTrue(heap.isEmpty());
  });
});
