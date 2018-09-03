import { assert } from 'chai';
import { TestFibonacciHeap } from './testUtils';

describe('union', () => {
  it('should union the 2 heaps together given 2 heaps of size 5 with overlapping elements added in order together', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(0);
    heap.insert(2);
    heap.insert(4);
    heap.insert(6);
    heap.insert(8);
    const other = new TestFibonacciHeap();
    other.insert(1);
    other.insert(3);
    other.insert(5);
    other.insert(7);
    other.insert(9);
    assert.equal(heap.size(), 5);
    assert.equal(other.size(), 5);

    heap.union(other);
    assert.equal(heap.size(), 10);
    for (let i = 0; i < 10; i++) {
      assert.equal(heap.extractMinimumUnsafe().key, i);
    }
    assert.isTrue(heap.isEmpty());
  });

  it('should union the 2 heaps together given 2 heaps of size 5 with overlapping elements added in reverse order together', () => {
    const heap = new TestFibonacciHeap();
    heap.insert(9);
    heap.insert(7);
    heap.insert(5);
    heap.insert(3);
    heap.insert(1);
    const other = new TestFibonacciHeap();
    other.insert(8);
    other.insert(6);
    other.insert(4);
    other.insert(2);
    other.insert(0);
    assert.equal(heap.size(), 5);
    assert.equal(other.size(), 5);

    heap.union(other);
    assert.equal(heap.size(), 10);
    for (let i = 0; i < 10; i++) {
      assert.equal(heap.extractMinimumUnsafe().key, i);
    }
    assert.isTrue(heap.isEmpty());
  });

  it('should union the 2 heaps together', () => {
    const heaps = constructJumbledHeaps();
    heaps[0].union(heaps[1]);
    assert.equal(heaps[0].size(), 10);
    for (let i = 0; i < 10; i++) {
      assert.equal(heaps[0].extractMinimumUnsafe().key, i);
    }
    assert.isTrue(heaps[0].isEmpty());
  });

  it('should union the 2 heaps together after extracting the minimum from each', () => {
    const heaps = constructJumbledHeaps();
    assert.equal(heaps[0].extractMinimumUnsafe().key, 1);
    assert.equal(heaps[1].extractMinimumUnsafe().key, 0);
    heaps[0].union(heaps[1]);
    assert.equal(heaps[0].size(), 8);
    for (let i = 2; i < 10; i++) {
      const min = heaps[0].extractMinimum();
      if (min === null) { assert.fail('extractMinimum must be non null'); return; }
      assert.equal(min.key, i);
    }
    assert.isTrue(heaps[0].isEmpty());
  });
});

function constructJumbledHeaps(): TestFibonacciHeap<number, null>[] {
  const first = new TestFibonacciHeap<number, null>();
  first.insert(9);
  first.insert(2);
  first.insert(6);
  first.insert(1);
  first.insert(3);
  assert.equal(first.size(), 5);
  const second = new TestFibonacciHeap<number, null>();
  second.insert(4);
  second.insert(8);
  second.insert(5);
  second.insert(7);
  second.insert(0);
  assert.equal(second.size(), 5);
  return [first, second];
}
