import { FibonacciHeap } from '../fibonacciHeap';
import { Node } from '../node';

export class TestFibonacciHeap<K, V> extends FibonacciHeap<K, V> {
  extractMinimumUnsafe(): Node<K, V> {
    return <Node<K, V>>this.extractMinimum();
  }

  findMinimumUnsafe(): Node<K, V> {
    return <Node<K, V>>this.findMinimum();
  }
}
