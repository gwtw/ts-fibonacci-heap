/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { Node } from './node';
import { INode } from './interfaces';
import { NodeListIterator } from './nodeListIterator';

export type CompareFunction<K, V> = (a: INode<K, V>, b: INode<K, V>) => number;

export class FibonacciHeap<K, V> {
  private _minNode: Node<K, V>;
  private _nodeCount: number = 0;

  constructor(
    private _compare?: CompareFunction<K, V>
  ) {
    if (!_compare) {
      this._compare = this._defaultCompare;
    }
  }

  /**
   * Clears the heap's data, making it an empty heap.
   */
  public clear(): void {
    this._minNode = undefined;
    this._nodeCount = 0;
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
    if (this._compare({key: newKey}, {key: node.key}) > 0) {
      throw new Error('New key is larger than old key');
    }

    node.key = newKey;
    const parent = node.parent;
    if (parent && this._compare(node, parent) < 0) {
      this._cut(node, parent, this._minNode);
      this._cascadingCut(parent, this._minNode);
    }
    if (this._compare(node, this._minNode) < 0) {
      this._minNode = node;
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
      this._cut(node, parent, this._minNode);
      this._cascadingCut(parent, this._minNode);
    }
    this._minNode = node;

    this.extractMinimum();
  }

  /**
   * Extracts and returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public extractMinimum(): Node<K, V> {
    const extractedMin = this._minNode;
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
      this._removeNodeFromList(extractedMin);
      this._nodeCount--;

      // Merge the children of the minimum node with the root list
      this._minNode = this._mergeLists(nextInRootList, extractedMin.child);
      if (this._minNode) {
        this._minNode = this._consolidate(this._minNode);
      }
    }
    return extractedMin;
  }

  /**
   * Returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public findMinimum(): Node<K, V> {
    return this._minNode;
  }

  /**
   * Inserts a new key-value pair into the heap.
   * @param key The key to insert.
   * @param value The value to insert.
   * @return node The inserted node.
   */
  public insert(key: K, value?: V): Node<K, V> {
    const node = new Node(key, value);
    this._minNode = this._mergeLists(this._minNode, node);
    this._nodeCount++;
    return node;
  }

  /**
   * @return Whether the heap is empty.
   */
  public isEmpty(): boolean {
    return this._minNode === undefined;
  }

  /**
   * @return The size of the heap.
   */
  public size(): number {
    if (this.isEmpty()) {
      return 0;
    }
    return this._getNodeListSize(this._minNode);
  }

  /**
   * Joins another heap to this heap.
   * @param other The other heap.
   */
  public union(other: FibonacciHeap<K, V>): void {
    this._minNode = this._mergeLists(this._minNode, other._minNode);
    this._nodeCount += other._nodeCount;
  }

  /**
   * Compares two nodes with each other.
   * @param a The first key to compare.
   * @param b The second key to compare.
   * @return -1, 0 or 1 if a < b, a == b or a > b respectively.
   */
  private _defaultCompare(a: INode<K, V>, b: INode<K, V>): number {
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
  private _cut(node: Node<K, V>, parent: Node<K, V>, minNode: Node<K, V>): Node<K, V> {
    node.parent = undefined;
    parent.degree--;
    if (node.next === node) {
      parent.child = undefined;
    } else {
      parent.child = node.next;
    }
    this._removeNodeFromList(node);
    minNode = this._mergeLists(minNode, node);
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
  private _cascadingCut(node: Node<K, V>, minNode: Node<K, V>): Node<K, V> {
    const parent = node.parent;
    if (parent) {
      if (node.isMarked) {
        minNode = this._cut(node, parent, minNode);
        minNode = this._cascadingCut(parent, minNode);
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
  private _consolidate(minNode: Node<K, V>): Node<K, V> {
    const aux = [];
    const it = new NodeListIterator<K, V>(minNode);
    while (it.hasNext()) {
      let current = it.next();

      // If there exists another node with the same degree, merge them
      while (aux[current.degree]) {
        if (this._compare(current, aux[current.degree]) > 0) {
          const temp = current;
          current = aux[current.degree];
          aux[current.degree] = temp;
        }
        this._linkHeaps(aux[current.degree], current);
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
        minNode = this._mergeLists(minNode, aux[i]);
      }
    }
    return minNode;
  }

  /**
   * Removes a node from a node list.
   * @param node The node to remove.
   */
  private _removeNodeFromList(node: Node<K, V>): void {
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
  private _linkHeaps(max: Node<K, V>, min: Node<K, V>): void {
    this._removeNodeFromList(max);
    min.child = this._mergeLists(max, min.child);
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
  private _mergeLists(a: Node<K, V>, b: Node<K, V>): Node<K, V> {
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

    return this._compare(a, b) < 0 ? a : b;
  }

  /**
   * Gets the size of a node list.
   * @param node A node within the node list.
   * @return The size of the node list.
   */
  private _getNodeListSize(node: Node<K, V>): number {
    let count = 0;
    let current = node;

    do {
      count++;
      if (current.child) {
        count += this._getNodeListSize(current.child);
      }
      current = current.next;
    } while (current !== node);

    return count;
  }
}
