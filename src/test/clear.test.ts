import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('clear', () => {
  it('should set the heap\'s size to 0', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.clear();
    assert.equal(heap.size(), 0);
  });

  it('should set the heap\'s minimum node to undefined', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.clear();
    assert.equal(heap.findMinimum(), undefined);
  });
});
