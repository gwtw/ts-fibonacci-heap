/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { Node } from './node';
import { IKeyComparable } from './interfaces';
import { NodeListIterator } from './nodeListIterator';

export type CompareFunction<K> = (a: IKeyComparable<K>, b: IKeyComparable<K>) => number;

export class FibonacciHeap<K, V> {
  // TODO: Use _ for private
  private minNode: Node<K, V>;
  private nodeCount: number = 0;

  constructor(
    private compare?: CompareFunction<K>
  ) {
    if (!compare) {
      this.compare = this._defaultCompare;
    }
  }

  /**
   * Clears the heap's data, making it an empty heap.
   */
  public clear(): void {
    this.minNode = undefined;
    this.nodeCount = 0;
  }

  /**
   * Decreases a key of a node.
   * @param node The node to decrease the key of.
   * @param newKey The new key to assign to the node.
   */
  public decreaseKey(node: Node<K, V>, newKey: K): void {
    if (!node) {
      throw new Error('Cannot decrease key of non-existent node');
    }
    if (this.compare({key: newKey}, {key: node.key}) > 0) {
      throw new Error('New key is larger than old key');
    }

    node.key = newKey;
    const parent = node.parent;
    if (parent && this.compare(node, parent) < 0) {
      this.cut(node, parent, this.minNode);
      this.cascadingCut(parent, this.minNode);
    }
    if (this.compare(node, this.minNode) < 0) {
      this.minNode = node;
    }
  }

  /**
   * Deletes a node.
   * @param node The node to delete.
   */
  public delete(node: Node<K, V>): void {
    // This is a special implementation of decreaseKey that sets the argument to
    // the minimum value. This is necessary to make generic keys work, since there
    // is no MIN_VALUE constant for generic types.
    const parent = node.parent;
    if (parent) {
      this.cut(node, parent, this.minNode);
      this.cascadingCut(parent, this.minNode);
    }
    this.minNode = node;

    this.extractMinimum();
  }

  /**
   * Extracts and returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public extractMinimum(): Node<K, V> {
    const extractedMin = this.minNode;
    if (extractedMin) {
      // Set parent to undefined for the minimum's children
      if (extractedMin.child) {
        let child = extractedMin.child;
        do {
          child.parent = undefined;
          child = child.next;
        } while (child !== extractedMin.child);
      }

      let nextInRootList;
      if (extractedMin.next !== extractedMin) {
        nextInRootList = extractedMin.next;
      }
      // Remove min from root list
      this.removeNodeFromList(extractedMin);
      this.nodeCount--;

      // Merge the children of the minimum node with the root list
      this.minNode = this.mergeLists(nextInRootList, extractedMin.child);
      if (this.minNode) {
        this.minNode = this.consolidate(this.minNode);
      }
    }
    return extractedMin;
  }

  /**
   * Returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public findMinimum(): Node<K, V> {
    return this.minNode;
  }

  /**
   * Inserts a new key-value pair into the heap.
   * @param key The key to insert.
   * @param value The value to insert.
   * @return node The inserted node.
   */
  public insert(key: K, value?: V): Node<K, V> {
    const node = new Node(key, value);
    this.minNode = this.mergeLists(this.minNode, node);
    this.nodeCount++;
    return node;
  }

  /**
   * @return Whether the heap is empty.
   */
  public isEmpty(): boolean {
    return this.minNode === undefined;
  }

  /**
   * @return The size of the heap.
   */
  public size(): number {
    if (this.isEmpty()) {
      return 0;
    }
    return this.getNodeListSize(this.minNode);
  }

  /**
   * Joins another heap to this heap.
   * @param other The other heap.
   */
  public union(other: FibonacciHeap<K, V>): void {
    this.minNode = this.mergeLists(this.minNode, other.minNode);
    this.nodeCount += other.nodeCount;
  }

  /**
   * Compares two nodes with each other.
   * @param a The first key to compare.
   * @param b The second key to compare.
   * @return -1, 0 or 1 if a < b, a == b or a > b respectively.
   */
  private _defaultCompare(a: IKeyComparable<K>, b: IKeyComparable<K>): number {
    if (a.key > b.key) {
      return 1;
    }
    if (a.key < b.key) {
      return -1;
    }
    return 0;
  }

  /**
   * Cut the link between a node and its parent, moving the node to the root list.
   * @param node The node being cut.
   * @param parent The parent of the node being cut.
   * @param minNode The minimum node in the root list.
   * @return The heap's new minimum node.
   */
  private cut(node: Node<K, V>, parent: Node<K, V>, minNode: Node<K, V>): Node<K, V> {
    node.parent = undefined;
    parent.degree--;
    if (node.next === node) {
      parent.child = undefined;
    } else {
      parent.child = node.next;
    }
    this.removeNodeFromList(node);
    minNode = this.mergeLists(minNode, node);
    node.isMarked = false;
    return minNode;
  }

  /**
   * Perform a cascading cut on a node; mark the node if it is not marked,
   * otherwise cut the node and perform a cascading cut on its parent.
   * @param node The node being considered to be cut.
   * @param minNode The minimum node in the root list.
   * @return The heap's new minimum node.
   */
  private cascadingCut(node: Node<K, V>, minNode: Node<K, V>): Node<K, V> {
    const parent = node.parent;
    if (parent) {
      if (node.isMarked) {
        minNode = this.cut(node, parent, minNode);
        minNode = this.cascadingCut(parent, minNode);
      } else {
        node.isMarked = true;
      }
    }
    return minNode;
  }

  /**
   * Merge all trees of the same order together until there are no two trees of
   * the same order.
   * @param minNode The current minimum node.
   * @return The new minimum node.
   */
  private consolidate(minNode: Node<K, V>): Node<K, V> {
    const aux = [];
    const it = new NodeListIterator<K, V>(minNode);
    while (it.hasNext()) {
      let current = it.next();

      // If there exists another node with the same degree, merge them
      while (aux[current.degree]) {
        if (this.compare(current, aux[current.degree]) > 0) {
          const temp = current;
          current = aux[current.degree];
          aux[current.degree] = temp;
        }
        this.linkHeaps(aux[current.degree], current);
        aux[current.degree] = undefined;
        current.degree++;
      }

      aux[current.degree] = current;
    }

    minNode = undefined;
    for (let i = 0; i < aux.length; i++) {
      if (aux[i]) {
        // Remove siblings before merging
        aux[i].next = aux[i];
        aux[i].prev = aux[i];
        minNode = this.mergeLists(minNode, aux[i]);
      }
    }
    return minNode;
  }

  /**
   * Removes a node from a node list.
   * @param node The node to remove.
   */
  private removeNodeFromList(node: Node<K, V>): void {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
    node.next = node;
    node.prev = node;
  }

  /**
   * Links two heaps of the same order together.
   *
   * @private
   * @param max The heap with the larger root.
   * @param min The heap with the smaller root.
   */
  private linkHeaps(max: Node<K, V>, min: Node<K, V>): void {
    this.removeNodeFromList(max);
    min.child = this.mergeLists(max, min.child);
    max.parent = min;
    max.isMarked = false;
  }

  /**
   * Merge two lists of nodes together.
   *
   * @private
   * @param a The first list to merge.
   * @param b The second list to merge.
   * @return The new minimum node from the two lists.
   */
  private mergeLists(a: Node<K, V>, b: Node<K, V>): Node<K, V> {
    if (!a && !b) {
      return undefined;
    }
    if (!a) {
      return b;
    }
    if (!b) {
      return a;
    }

    const temp = a.next;
    a.next = b.next;
    a.next.prev = a;
    b.next = temp;
    b.next.prev = b;

    return this.compare(a, b) < 0 ? a : b;
  }

  /**
   * Gets the size of a node list.
   * @param node A node within the node list.
   * @return The size of the node list.
   */
  private getNodeListSize(node: Node<K, V>): number {
    let count = 0;
    let current = node;

    do {
      count++;
      if (current.child) {
        count += this.getNodeListSize(current.child);
      }
      current = current.next;
    } while (current !== node);

    return count;
  }
}
