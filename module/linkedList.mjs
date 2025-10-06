
/**
 * Implementation of a doubly-linked Linked List.
 */
export class LinkedList {
    /**
     * Create a new linked list, optionally with some initial items.
     * @param  {...any} items Initial items in the list.
     */
    constructor(...items) {
        const head = LinkedListNode.makeSentinel();
        const tail = LinkedListNode.makeSentinel();
        head.next = tail;
        tail.prev = head;

        /**
         * First item in the linked list
         * @type {LinkedListNode}
         */
        this.head = head;
        
        /**
         * Last item in the linked list
         * @type {LinkedListNode}
         * @deprecated
         */
        this.tail = tail;

        //Initialize list
        //this.append(...items);
        for (const item of items) {
            this.append(item);
        }
    }

    append(item) {
        this.tail.addBefore(item);
    }

    prepend(item) {
        this.head.addAfter(item);
    }

    * iterateNodes(direction = 1) {
        const startNode = direction < 0
            ? this.tail.prev
            : this.head.next;
        yield * startNode.iterate(direction);
    }

    * [Symbol.iterator]() {
        yield * this.iterateNodes().map(n => n.item);
    }
    


    /**
     * Append a new item to the end of the list.
     * @param {any} item - Data item to append.
     * @deprecated
     */
    appendItem(item) {
        this.tail.insertItemAfter(item);
    }

    /**
     * Append a new item to the start of the list.
     * @param {any} item - Data item to prepend.
     * @deprecated
     */
    prependItem(item) {
        this.head.insertItemBefore(item);
    }

    /**
     * Iterate the nodes in this list, with an optional condition.
     * @param {boolean} fromLast - true to iterate the nodes from last to first.
     * @param {compareLinkedListNodeItem} compareFn 
     * @yields {LinkedListNode}
     * @deprecated
     */
    * nodes(fromLast = false, compareFn) {
        const startNode = fromLast ? this.tail : this.head;
        if (startNode) {
            for (const node of startNode.nodesSubsequent(fromLast)) {
                if (!compareFn || compareFn(node.item)) {
                    yield node;
                }
            }
        }
    }

    /**
     * Iterate all the items in this list.
     * @param {boolean} fromLast - true to iterate the nodes from last to first.
     * @yields {any}
     * @deprecated
     */
    * items(fromLast = false) {
        for (const node of this.nodes(fromLast)) {
            yield node.item;
        }
    }

    /**
     * Finds the nth node with item matching the compare function
     * @param {compareLinkedListNodeItem} compareFn 
     * @param {number} nth - finds the nth matching node (default 1); negative forces toHead = true.
     * @param {boolean} fromLast - true to iterate the nodes from last to first.
     * @returns {LinkedListNode?}
     * @deprecated
     */
    findNode(compareFn, nth = 1, fromLast = false) {
        const startNode = fromLast ? this.tail : this.head;
        return findNode(startNode, compareFn, nth, fromLast);
    }
}


/**
 * Implementation of a node in a doubly-linked {@link LinkedList}.
 */
export class LinkedListNode {
    /**
     * Build a new node for the list with the provided data item.
     * @param {any} item - Data item for this linked list node.
     */
    constructor(item) {
        /**
         * Data item for this linked list node.
         * @type {any}
         */
        this.item = item;
        /**
         * Previous node in this linked list (sentinel if first).
         * @type {LinkedListNode}
         */
        this.prev = null;
        /**
         * Next node in this linked list (sentinel if last).
         * @type {LinkedListNode}
         */
        this.next = null;
        /**
         * Containing list of this node; null if this is not in a list at the moment.
         * @deprecated
         */
        this.list = null;

        /**
         * Flag indicating if this node is the sentinel.
         * @type {boolean}
         */
        this.sentinel = false;
    }

    /**
     * Makes a sentinel for a linked list.
     * @returns {LinkedListNode}
     */
    static makeSentinel() {
        const s = new LinkedListNode(null);
        s.sentinel = true;
        return s;
    }

    /**
     * Add the provided item before this node.
     * A {@link LinkedListNode} will be added directly (removing from it's previous list/location),
     *  but anything else will be wrapped in a new node first.
     *
     * Does nothing if this is not is not in a list already.
     * @param {any} item 
     */
    addBefore(item) {
        if (!this.prev) return;
        const node = nodify(item);
        //clear any existing links on new node
        node.remove();
        //this.prev ↔ node ↔ this
        node.prev = this.prev;
        node.next = this;
        this.prev.next = node;
        this.prev = node;
    }

    /**
     * Add the provided item after this node.
     * A {@link LinkedListNode} will be added directly (removing from it's previous list/location),
     *  but anything else will be wrapped in a new node first.
     *
     * Does nothing if this is not is not in a list already.
     * @param {any} item 
     */
    addAfter(item) {
        if (!this.next) return;
        const node = nodify(item);
        //clear any existing links on new node
        node.remove();
        //this ↔ node ↔ this.next
        node.prev = this;
        node.next = this.next;
        this.next.prev = node;
        this.next = node;
    }

    /**
     * Replaces a node with a new item.
     * A {@link LinkedListNode} will be added directly (removing from it's previous list/location),
     *  but anything else will be wrapped in a new node first.
     *
     * Does nothing if this is not is not in a list already.
     * @param {any} item 
     */
    replace(item) {
        if (this.sentinel) throw "Cannot replace sentinel!";
        if (!this.prev) return;
        if (!this.next) return;
        const node = nodify(item);
        //clear any existing links on new node
        node.remove();
        //this.prev ↔ node ↔ this.next
        node.prev = this.prev;
        node.next = this.next;
        this.prev.next = node;
        this.next.prev = node;
        this.prev = null;
        this.next = null;
    }


    /**
     * Remove a node from its list.
     * Does nothing if not is not in a list already.
     */
    remove() {
        if (this.sentinel) throw "Cannot remove sentinel!";
        if (!this.prev && !this.next) return;
        //this.prev ↔ this.next
        this.prev.next = this.next;
        this.next.prev = this.prev;
        this.prev = null;
        this.next = null;
    }

    /**
     * Iterate from this node to the sentinel,
     *  in either the 'next' or 'prev' direction.
     * @param {number} direction Positive: next; Negative: prev
     * @yields {LinkedListNode}
     */
    * iterate(direction = 1) {
        const dir = direction < 0 ? 'prev' : 'next';
        let cur = this; //.sentinel ? this[dir] : this;
        while (!cur.sentinel) {
            yield cur;
            cur = cur[dir];
        }
    }

    




    /**
     * Replace a linked list node with another node.
     * @param {LinkedListNode} node - Node to add in place of this node
     * @deprecated
     */
    replaceWith(node) {
        replaceNode(this, node);
    }

    /**
     * Inserts a new item in the linked list, immediately after this one.
     * @param {any} item - Data item to add.
     * @deprecated
     */
    insertItemAfter(item) {
        const newNode = new LinkedListNode(item);
        this.insertNodeAfter(newNode);
    }

    /**
     * Inserts a node in the linked list, immediately after this one.
     * If new node is already in a list, it is removed from that one before adding it here.
     * @param {LinkedListNode} node - Node to insert.
     * @deprecated
     */
    insertNodeAfter(node) {
        insertNodeAfter(this, node);
    }

    /**
     * Inserts a new item in the linked list, immediately before this one.
     * @param {any} item - Data item to add.
     * @deprecated
     */
    insertItemBefore(item) {
        const newNode = new LinkedListNode(item);
        this.insertNodeBefore(newNode);
    }

    /**
     * Inserts a node in the linked list, immediately before this one.
     * If new node is already in a list, it is removed from that one before adding it here.
     * @param {LinkedListNode} node - Node to insert.
     * @deprecated
     */
    insertNodeBefore(node) {
        insertNodeBefore(this, node);
    }

    /**
     * Iterates the nodes in the list from this node to the tail.
     * @param {LinkedListNode} thisNode - Node to begin with.
     * @yields {LinkedListNode}
     * @deprecated
     */
    * nodesToTail() {
        yield * nodesToTail(this);
    }

    /**
     * Iterates the nodes in the list in reverse order from this node to the head.
     * @param {LinkedListNode} thisNode - Node to begin with.
     * @yields {LinkedListNode}
     * @deprecated
     */
    * nodesToHead() {
        yield * nodesToHead(this);
    }

    /**
     * Iterates the nodes in the list from this node to the end,
     *   in the direction indicated (default: to Tail).
     * @param {boolean} toHead - false to go toward the tail, true to go toward the head
     * @yields {LinkedListNode}
     * @deprecated
     */
    * nodesSubsequent(toHead = false) {
        yield * nodesSubsequent(this, toHead);
    }


    /**
     * Finds the nth node subsequent to this with item matching the compare function
     * @param {LinkedListNode} startNode - start node of search
     * @param {compareLinkedListNodeItem} compareFn 
     * @param {number} nth - finds the nth matching node (default 1); negative forces toHead = true.
     * @param {boolean} toHead - false to search toward the tail (default), true to search toward the head
     * @returns {LinkedListNode?}
     * @deprecated
     */
    findNext(compareFn, nth = 1, toHead = false) {
        return findNode(this, compareFn, nth, toHead);
    }
}



/**
 * Set the list's items to the provided items.
 * @param {LinkedList} list
 * @param {any[]} items 
 */
function setListItems(list, items) {
    //Guard: no items
    if (items.length === 0) {
        list.head = null;
        list.tail = null;
        return;
    }
    //Add the first item as the head
    let prevNode = null;
    let curNode = new LinkedListNode(items[0]);
    curNode.list = list;
    list.head = curNode;
    //Add the rest of the items
    for (let i = 1; i < items.length; ++i) {
        prevNode = curNode;
        curNode = new LinkedListNode(items[i]);
        curNode.list = list;
        curNode.prev = prevNode;
        prevNode.next = curNode;
    }
    //Update the list with the last node
    list.tail = curNode;
}


/**
 * Remove a node from its list.
 * Does nothing if not is not in a list already.
 * @param {LinkedListNode} thisNode - Node to remove
 */
function removeNode(thisNode) {
    //Guard
    const list = thisNode.list;
    if (!list) return;
    //Update parent list if node was the first
    if (list.head === thisNode) {
        list.head = thisNode.next;
    }
    //Update parent list if node was the last
    if (list.tail === thisNode) {
        list.tail = thisNode.prev;
    }
    //Update adjacent nodes to skip this node
    if (thisNode.prev !== null) {
        thisNode.prev.next = thisNode.next;
    }
    if (thisNode.next !== null) {
        thisNode.next.prev = thisNode.prev;
    }
    //Clear refs
    thisNode.list = null;
    thisNode.prev = null;
    thisNode.next = null;
}

/**
 * Replace a linked list node with another node.
 * @param {LinkedListNode} thisNode - Node to remove
 * @param {LinkedListNode} newNode - Node to add in place of this node
 */
function replaceNode(thisNode, newNode) {
    //Guard
    const list = thisNode.list;
    if (!list) return;
    if (thisNode === newNode) return;
    //Update newNode with same links out
    newNode.list = list;
    newNode.prev = thisNode.prev;
    newNode.next = thisNode.next;
    //Update parent list if node was the first
    if (list.head === thisNode) {
        list.head = newNode;
    }
    //Update parent list if node was the last
    if (list.tail === thisNode) {
        list.tail = newNode;
    }
    //Update adjacent nodes to link to this node
    if (thisNode.prev !== null) {
        thisNode.prev.next = newNode;
    }
    if (thisNode.next !== null) {
        thisNode.next.prev = newNode;
    }
    //Clear refs
    thisNode.list = null;
    thisNode.next = null;
    thisNode.prev = null;
}

/**
 * Inserts a node in the linked list, immediately after this one.
 * If new node is already in a list, it is removed from that one before adding it here.
 * @param {LinkedListNode} thisNode 
 * @param {LinkedListNode} newNode 
 * @deprecated
 */
function insertNodeAfter(thisNode, newNode) {
    //Guard
    if (thisNode === newNode) return;
    //ensure new node if properly removed from previous list if necessary
    removeNode(newNode);
    //new node takes this node's place
    newNode.prev = thisNode.prev;
    newNode.next = thisNode.next;
    newNode.list = thisNode.list;
    //new node goes between this node and the one after it
    if (thisNode.next) {
        thisNode.next.prev = newNode;
    }
    thisNode.next = newNode;
    //if this node was the tail, update the parent list
    if (thisNode.list.tail === thisNode) {
        thisNode.list.tail = newNode;
    }
}

/**
 * Insert a node 
 * @param {LinkedListNode} thisNode 
 * @param {LinkedListNode} newNode 
 * @deprecated
 */
function insertNodeBefore(thisNode, newNode) {
    //Guard
    if (thisNode == newNode) return;
    //ensure new node if properly removed from previous list if necessary
    removeNode(newNode);
    //new node takes this node's place
    newNode.prev = thisNode.prev;
    newNode.next = thisNode.next;
    newNode.list = thisNode.list;
    //new node goes between this node and the one before it
    if (thisNode.prev) {
        thisNode.prev.next = newNode;
    }
    thisNode.prev = newNode;
    //if this node was the head, update the parent list
    if (thisNode.list.head === thisNode) {
        thisNode.list.head = newNode;
    }
}

/**
 * Iterates the nodes in the list from this node to the tail.
 * @param {LinkedListNode} thisNode - Node to begin with.
 * @yields {LinkedListNode}
 * @deprecated
 */
function * nodesToTail(thisNode) {
    if (!thisNode) return;
    let curNode = thisNode;
    while (curNode !== null) {
        yield curNode;
        curNode = curNode.next;
    }
}

/**
 * Iterates the nodes in the list in reverse order from this node to the head.
 * @param {LinkedListNode} thisNode - Node to begin with.
 * @yields {LinkedListNode}
 * @deprecated
 */
function * nodesToHead(thisNode) {
    if (!thisNode) return;
    let curNode = thisNode;
    while (curNode !== null) {
        yield curNode;
        curNode = curNode.prev;
    }
}

/**
 * Iterates the nodes in the list from this node to the end,
 *   in the direction indicated (default: to Tail).
 * @param {LinkedListNode} thisNode - Node to begin with
 * @param {boolean} toHead - false to go toward the tail, true to go toward the head
 * @yields {LinkedListNode}
 * @deprecated
 */
function * nodesSubsequent(thisNode, toHead = false) {
    if (toHead) {
        yield * nodesToHead(thisNode);
    } else {
        yield * nodesToTail(thisNode);
    }
}

/**
 * Finds the nth node with item matching the compare function
 * @param {LinkedListNode} startNode - start node of search
 * @param {compareLinkedListNodeItem} compareFn 
 * @param {number} nth - finds the nth matching node (default 1); negative forces toHead = true.
 * @param {boolean} toHead - false to search toward the tail (default), true to search toward the head
 * @returns {LinkedListNode?}
 */
function findNode(startNode, compareFn, nth = 1, toHead = false) {
    //Guard
    if (!startNode) return null;

    //Massage
    if (nth == 0) { nth = 1; }
    if (nth < 0) { toHead = true; nth = -nth; }

    //Search
    let counter = 0;
    for (const node of startNode.nodesSubsequent(toHead)) {
        if (node.item === compareFn || compareFn(node.item)) {
            ++counter;
            if (counter === nth) { return node; }
        }
    }
    //Not found
    return null;
}

function nodify(item) {
    if (item instanceof LinkedListNode) {
        return item;
    }
    return new LinkedListNode(item);
}

/**
 * Compare function callback for {@link LinkedList} node item comparisons.
 * @callback compareLinkedListNodeItem
 * @param {any} item - Item to compare
 * @returns {boolean}
 */
