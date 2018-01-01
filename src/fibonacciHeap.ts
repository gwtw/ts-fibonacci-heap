import { Node } from "./node";
import { IKeyComparable } from "./interfaces";

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
  public clear() {
    this.minNode = undefined;
    this.nodeCount = 0;
  }

  /**
   * Decreases a key of a node.
   * @param node The node to decrease the key of.
   * @param newKey The new key to assign to the node.
   */
  public decreaseKey(node: Node<K, V>, newKey: K) {
    if (!node) {
      throw new Error('Cannot decrease key of non-existent node');
    }
    if (this.compare({key: newKey}, {key: node.key}) > 0) {
      throw new Error('New key is larger than old key');
    }

    node.key = newKey;
    var parent = node.parent;
    if (parent && this.compare(node, parent) < 0) {
      cut(node, parent, this.minNode, this.compare);
      cascadingCut(parent, this.minNode, this.compare);
    }
    if (this.compare(node, this.minNode) < 0) {
      this.minNode = node;
    }
  }

  /**
   * Deletes a node.
   * @param node The node to delete.
   */
  public delete(node: Node<K, V>) {
    // This is a special implementation of decreaseKey that sets the argument to
    // the minimum value. This is necessary to make generic keys work, since there
    // is no MIN_VALUE constant for generic types.
    var parent = node.parent;
    if (parent) {
      cut(node, parent, this.minNode, this.compare);
      cascadingCut(parent, this.minNode, this.compare);
    }
    this.minNode = node;

    this.extractMinimum();
  }

  /**
   * Extracts and returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public extractMinimum() {
    var extractedMin = this.minNode;
    if (extractedMin) {
      // Set parent to undefined for the minimum's children
      if (extractedMin.child) {
        var child = extractedMin.child;
        do {
          child.parent = undefined;
          child = child.next;
        } while (child !== extractedMin.child);
      }

      var nextInRootList;
      if (extractedMin.next !== extractedMin) {
        nextInRootList = extractedMin.next;
      }
      // Remove min from root list
      removeNodeFromList(extractedMin);
      this.nodeCount--;

      // Merge the children of the minimum node with the root list
      this.minNode = mergeLists(nextInRootList, extractedMin.child, this.compare);
      if (this.minNode) {
        this.minNode = consolidate(this.minNode, this.compare);
      }
    }
    return extractedMin;
  }

  /**
   * Returns the minimum node from the heap.
   * @return The heap's minimum node or undefined if the heap is empty.
   */
  public findMinimum() {
    return this.minNode;
  }

  /**
   * Inserts a new key-value pair into the heap.
   * @param key The key to insert.
   * @param value The value to insert.
   * @return node The inserted node.
   */
  public insert(key: K, value?: V) {
    var node = new Node(key, value);
    this.minNode = mergeLists(this.minNode, node, this.compare);
    this.nodeCount++;
    return node;
  }

  /**
   * @return Whether the heap is empty.
   */
  public isEmpty() {
    return this.minNode === undefined;
  }

  /**
   * @return The size of the heap.
   */
  public size() {
    if (this.isEmpty()) {
      return 0;
    }
    return getNodeListSize(this.minNode);
  }

  /**
   * Joins another heap to this heap.
   * @param other The other heap.
   */
  public union(other: FibonacciHeap<K, V>) {
    this.minNode = mergeLists(this.minNode, other.minNode, this.compare);
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
  };
}



/**
 * Creates an Iterator used to simplify the consolidate() method. It works by
 * making a shallow copy of the nodes in the root list and iterating over the
 * shallow copy instead of the source as the source will be modified.
 *
 * @private
 * @param {Node} start A node from the root list.
 */
var NodeListIterator = function (start) {
  this.index = -1;
  this.items = [];
  var current = start;
  do {
    this.items.push(current);
    current = current.next;
  } while (start !== current);
};

/**
 * @return {boolean} Whether there is a next node in the iterator.
 */
NodeListIterator.prototype.hasNext = function () {
  return this.index < this.items.length - 1;
};

/**
 * @return {Node} The next node.
 */
NodeListIterator.prototype.next = function () {
  return this.items[++this.index];
};

/**
 * Cut the link between a node and its parent, moving the node to the root list.
 *
 * @private
 * @param {Node} node The node being cut.
 * @param {Node} parent The parent of the node being cut.
 * @param {Node} minNode The minimum node in the root list.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The heap's new minimum node.
 */
function cut(node, parent, minNode, compare) {
  node.parent = undefined;
  parent.degree--;
  if (node.next === node) {
    parent.child = undefined;
  } else {
    parent.child = node.next;
  }
  removeNodeFromList(node);
  minNode = mergeLists(minNode, node, compare);
  node.isMarked = false;
  return minNode;
}

/**
 * Perform a cascading cut on a node; mark the node if it is not marked,
 * otherwise cut the node and perform a cascading cut on its parent.
 *
 * @private
 * @param {Node} node The node being considered to be cut.
 * @param {Node} minNode The minimum node in the root list.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The heap's new minimum node.
 */
function cascadingCut(node, minNode, compare) {
  var parent = node.parent;
  if (parent) {
    if (node.isMarked) {
      minNode = cut(node, parent, minNode, compare);
      minNode = cascadingCut(parent, minNode, compare);
    } else {
      node.isMarked = true;
    }
  }
  return minNode;
}

/**
 * Merge all trees of the same order together until there are no two trees of
 * the same order.
 *
 * @private
 * @param {Node} minNode The current minimum node.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The new minimum node.
 */
function consolidate(minNode, compare) {
  var aux = [];
  var it = new NodeListIterator(minNode);
  while (it.hasNext()) {
    var current = it.next();

    // If there exists another node with the same degree, merge them
    while (aux[current.degree]) {
      if (compare(current, aux[current.degree]) > 0) {
        var temp = current;
        current = aux[current.degree];
        aux[current.degree] = temp;
      }
      linkHeaps(aux[current.degree], current, compare);
      aux[current.degree] = undefined;
      current.degree++;
    }

    aux[current.degree] = current;
  }

  minNode = undefined;
  for (var i = 0; i < aux.length; i++) {
    if (aux[i]) {
      // Remove siblings before merging
      aux[i].next = aux[i];
      aux[i].prev = aux[i];
      minNode = mergeLists(minNode, aux[i], compare);
    }
  }
  return minNode;
}

/**
 * Removes a node from a node list.
 *
 * @private
 * @param {Node} node The node to remove.
 */
function removeNodeFromList(node) {
  var prev = node.prev;
  var next = node.next;
  prev.next = next;
  next.prev = prev;
  node.next = node;
  node.prev = node;
}

/**
 * Links two heaps of the same order together.
 *
 * @private
 * @param {Node} max The heap with the larger root.
 * @param {Node} min The heap with the smaller root.
 * @param {function} compare The node comparison function to use.
 */
function linkHeaps(max, min, compare) {
  removeNodeFromList(max);
  min.child = mergeLists(max, min.child, compare);
  max.parent = min;
  max.isMarked = false;
}

/**
 * Merge two lists of nodes together.
 *
 * @private
 * @param {Node} a The first list to merge.
 * @param {Node} b The second list to merge.
 * @param {function} compare The node comparison function to use.
 * @return {Node} The new minimum node from the two lists.
 */
function mergeLists(a, b, compare) {
  if (!a && !b) {
    return undefined;
  }
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }

  var temp = a.next;
  a.next = b.next;
  a.next.prev = a;
  b.next = temp;
  b.next.prev = b;

  return compare(a, b) < 0 ? a : b;
}

/**
 * Gets the size of a node list.
 *
 * @private
 * @param {Node} node A node within the node list.
 * @return {number} The size of the node list.
 */
function getNodeListSize(node) {
  var count = 0;
  var current = node;

  do {
    count++;
    if (current.child) {
      count += getNodeListSize(current.child);
    }
    current = current.next;
  } while (current !== node);

  return count;
}
