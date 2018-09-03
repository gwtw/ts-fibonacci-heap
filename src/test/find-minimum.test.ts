import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('findMinimum', () => {
  it('should return the minimum item from the heap', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(5);
    heap.insert(3);
    heap.insert(1);
    heap.insert(4);
    heap.insert(2);
    assert.equal(heap.findMinimumUnsafe().key, 1);
  });
});
