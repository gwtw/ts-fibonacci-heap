import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('integration', () => {
  it('should work with string keys', () => {
    const heap = new TestFibonacciHeap();
    const node3 = heap.insert('f');
    const node4 = heap.insert('o');
    const node2 = heap.insert('c');
    const node1 = heap.insert('a');
    const node5 = heap.insert('q');
    assert.equal(heap.size(), 5);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node1.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node2.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node3.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node4.key);
    assert.deepEqual(heap.extractMinimumUnsafe().key, node5.key);
    assert.isTrue(heap.isEmpty());
  });

  it('should give an empty heap after inserting and extracting 1000 in-order elements', () => {
    const heap = new TestFibonacciHeap();
    for (let i = 0; i < 1000; i++) {
      heap.insert(i, i);
    }
    for (let i = 0; i < 1000; i++) {
      heap.extractMinimum();
    }
    assert.isTrue(heap.isEmpty());
  });

  it('should give an empty heap after inserting and extracting 1000 reversed elements', () => {
    const heap = new TestFibonacciHeap();
    for (let i = 0; i < 1000; i++) {
      heap.insert(i, i);
    }
    for (let i = 0; i < 1000; i++) {
      heap.extractMinimum();
    }
    assert.isTrue(heap.isEmpty());
  });

  it('should give an empty heap after inserting and extracting 1000 pseudo-randomized elements', () => {
    const heap = new TestFibonacciHeap();
    for (let i = 0; i < 1000; i++) {
      if (i % 2 === 0) {
        heap.insert(i, i);
      } else {
        heap.insert(999 - i, 999 - i);
      }
    }
    for (let i = 0; i < 1000; i++) {
      heap.extractMinimum();
    }
    assert.isTrue(heap.isEmpty());
  });

  it('should handle 1000 shuffled elements', () => {
    const heap = new TestFibonacciHeap();
    const input: number[] = [];
    for (let i = 0; i < 1000; i++) {
      input.push(i);
    }
    // shuffle
    for (let i = 0; i < 1000; i++) {
      const swapWith = Math.floor(Math.random() * 1000);
      const temp = input[i];
      input[i] = input[swapWith];
      input[swapWith] = temp;
    }
    // insert
    for (let i = 0; i < 1000; i++) {
      heap.insert(input[i]);
    }
    // extract
    const output = [];
    const errorReported = false;
    let counter = 0;
    while (!heap.isEmpty()) {
      output.push(heap.extractMinimumUnsafe().key);
      if (!errorReported && counter !== output[output.length - 1]) {
        assert.fail('the heap property was not maintained (elements in order 0, 1, 2, ..., 997, 998, 999)');
      }
      counter++;
    }
    assert.equal(output.length, 1000);
  });
});
