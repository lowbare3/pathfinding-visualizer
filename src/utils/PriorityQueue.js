/**
 * Priority Queue implementation using binary heap
 * Used for Dijkstra's algorithm, A*, and Greedy Best-First Search
 */
export class PriorityQueue {
  constructor() {
    this.elements = [];
    this.length = 0;
  }

  push(data) {
    this.elements.push(data);
    this.length++;
    this.upHeapify(this.length - 1);
  }

  pop() {
    if (this.length === 0) return null;
    
    this.swap(0, this.length - 1);
    const popped = this.elements.pop();
    this.length--;
    this.downHeapify(0);
    return popped;
  }

  upHeapify(i) {
    if (i === 0) return;
    const parent = Math.floor((i - 1) / 2);
    if (this.elements[i].cost < this.elements[parent].cost) {
      this.swap(parent, i);
      this.upHeapify(parent);
    }
  }

  downHeapify(i) {
    let minNode = i;
    const leftChild = (2 * i) + 1;
    const rightChild = (2 * i) + 2;

    if (leftChild < this.length && this.elements[leftChild].cost < this.elements[minNode].cost) {
      minNode = leftChild;
    }
    if (rightChild < this.length && this.elements[rightChild].cost < this.elements[minNode].cost) {
      minNode = rightChild;
    }

    if (minNode !== i) {
      this.swap(minNode, i);
      this.downHeapify(minNode);
    }
  }

  isEmpty() {
    return this.length === 0;
  }

  swap(x, y) {
    [this.elements[x], this.elements[y]] = [this.elements[y], this.elements[x]];
  }
}
