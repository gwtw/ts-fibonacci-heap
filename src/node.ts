/**
 * @license
 * Copyright Daniel Imms <http://www.growingwiththeweb.com>
 * Released under MIT license. See LICENSE in the project root for details.
 */

import { INode } from './interfaces';

export class Node<K, V> implements INode<K, V> {
  public key: K;
  public value: V;
  public prev: Node<K, V>;
  public next: Node<K, V>;
  public parent: Node<K, V>;
  public child: Node<K, V>;

  public degree: number = 0;
  public isMarked: boolean = false;

  constructor(key: K, value?: V) {
    this.key = key;
    this.value = value;
    this.prev = this;
    this.next = this;
  }
}
