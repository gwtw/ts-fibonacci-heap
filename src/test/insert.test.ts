import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('insert', () => {
  it('should insert items into the heap', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(1);
    heap.insert(2);
    heap.insert(3);
    heap.insert(4);
    heap.insert(5);
    assert.deepEqual(heap.size(), 5);
  });

  it('should return the inserted node', () => {
    const heap = new TestFibonacciHeap();
    const ret = heap.insert(1, {foo: 'bar'});
    assert.equal(ret.key, 1);
    assert.deepEqual(ret.value, {foo: 'bar'});
  });

  it('should insert multiple items with the same key', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(1);
    heap.insert(1);
    assert.equal(1, heap.extractMinimumUnsafe().key);
    assert.equal(1, heap.extractMinimumUnsafe().key);
  });
});
