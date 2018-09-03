import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('size', () => {
  it('should return the size of the heap', () => {
    const heap = new TestFibonacciHeap();
    assert.equal(heap.size(), 0);
    heap.insert(1);
    assert.equal(heap.size(), 1);
    heap.insert(2);
    assert.equal(heap.size(), 2);
    heap.insert(3);
    assert.equal(heap.size(), 3);
    heap.insert(4);
    assert.equal(heap.size(), 4);
    heap.insert(5);
    assert.equal(heap.size(), 5);
    heap.insert(6);
    assert.equal(heap.size(), 6);
    heap.insert(7);
    assert.equal(heap.size(), 7);
    heap.insert(8);
    assert.equal(heap.size(), 8);
    heap.insert(9);
    assert.equal(heap.size(), 9);
    heap.insert(10);
    assert.equal(heap.size(), 10);
  });
});
