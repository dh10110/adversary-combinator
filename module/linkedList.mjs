
/**
 * Implementation of a doubly-linked Linked List.
 */
export class LinkedList {
    /**
     * Create a new linked list, optionally with some initial items.
     * @param  {...any} items Initial items in the list.
     */
    constructor(...items) {
        /**
         * First item in the linked list
         * @type {LinkedListNode?}
         */
        this.head = null;
        
        /**
         * Last item in the linked list
         * @type {LinkedListNode?}
         */
        this.tail = null;

        //Initialize list
        setListItems(this, items);
    }

    /**
     * Append a new item to the end of the list.
     * @param {any} item - Data item to append.
     */
    appendItem(item) {
        this.tail.insertItemAfter(item);
    }

    /**
     * Append a new item to the start of the list.
     * @param {any} item - Data item to prepend.
     */
    prependItem(item) {
        this.head.insertItemBefore(item);
    }

    /**
     * Iterate all the nodes in this list.
     * @param {boolean} fromLast - true to iterate the nodes from last to first.
     * @yields {LinkedListNode}
     */
    * nodes(fromLast = false) {
        if (fromLast === true) {
            yield * this.tail.nodesToTail();
        } else {
            yield * this.head.nodesToHead();
        }
    }

    /**
     * Iterate all the items in this list.
     * @param {boolean} fromLast - true to iterate the nodes from last to first.
     * @yields {any}
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
     */
    findNode(compareFn, nth = 1, fromLast = false) {
        return findNode(this.head, compareFn, nth, fromLast);
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
         * Previous node in this linked list; null if this is first node.
         * @type {LinkedListNode?}
         */
        this.prev = null;
        /**
         * Next node in this linked list; null if this is last node.
         */
        this.next = null;
        /**
         * Containing list of this node; null if this is not in a list at the moment.
         */
        this.list = null;
    }

    /**
     * Inserts a new item in the linked list, immediately after this one.
     * @param {any} item - Data item to add.
     */
    insertItemAfter(item) {
        const newNode = new LinkedListNode(item);
        this.insertNodeAfter(newNode);
    }

    /**
     * Inserts a node in the linked list, immediately after this one.
     * If new node is already in a list, it is removed from that one before adding it here.
     * @param {LinkedListNode} node - Node to insert.
     */
    insertNodeAfter(node) {
        insertNodeAfter(this, node);
    }

    /**
     * Inserts a new item in the linked list, immediately before this one.
     * @param {any} item - Data item to add.
     */
    insertItemBefore(item) {
        const newNode = new LinkedListNode(item);
        this.insertNodeBefore(newNode);
    }

    /**
     * Inserts a node in the linked list, immediately before this one.
     * If new node is already in a list, it is removed from that one before adding it here.
     * @param {LinkedListNode} node - Node to insert.
     */
    insertNodeBefore(node) {
        insertNodeBefore(this, node);
    }

    /**
     * Iterates the nodes in the list from this node to the tail.
     * @param {LinkedListNode} thisNode - Node to begin with.
     * @yields {LinkedListNode}
     */
    * nodesToTail() {
        yield * nodesToTail(this);
    }

    /**
     * Iterates the nodes in the list in reverse order from this node to the head.
     * @param {LinkedListNode} thisNode - Node to begin with.
     * @yields {LinkedListNode}
     */
    * nodesToHead() {
        yield * nodesToHead(this);
    }

    /**
     * Iterates the nodes in the list from this node to the end,
     *   in the direction indicated (default: to Tail).
     * @param {boolean} toHead - false to go toward the tail, true to go toward the head
     * @yields {LinkedListNode}
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
 * @param {LinkedListNode} node - Node to remove
 */
function removeNode(node) {
    //Guard
    if (node.list === null) return;
    //Remove
    const list = node.list;
    //Update parent list if node was the first
    if (list.head === node) {
        list.head = node.next;
    }
    //Update parent list if node was the last
    if (list.tail === node) {
        list.tail = node.prev;
    }
    //Update adjacent nodes to skip this node
    if (node.prev !== null) {
        node.prev.next = node.next;
    }
    if (node.next !== null) {
        node.next.prev = node.prev;
    }
}

/**
 * Inserts a node in the linked list, immediately after this one.
 * If new node is already in a list, it is removed from that one before adding it here.
 * @param {LinkedListNode} thisNode 
 * @param {LinkedListNode} newNode 
 */
function insertNodeAfter(thisNode, newNode) {
    //ensure new node if properly removed from previous list if necessary
    removeNode(newNode);
    //new node takes this node's place
    newNode.prev = thisNode.prev;
    newNode.next = thisNode.next;
    newNode.list = thisNode.list;
    //new node follows this node
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
 */
function insertNodeBefore(thisNode, newNode) {
    //new node takes this node's place
    newNode.prev = thisNode.prev;
    newNode.next = thisNode.next;
    newNode.list = thisNode.list;
    //new node precedes this node
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
 */
function * nodesToTail(thisNode) {
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
 */
function * nodesToHead(thisNode) {
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
 */
function * nodesSubsequent(thisNode, toHead = false) {
    if (toHead) {
        nodesToHead(thisNode);
    } else {
        nodesToTail(thisNode);
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

/**
 * Compare function callback for {@link LinkedList} node item comparisons.
 * @callback compareLinkedListNodeItem
 * @param {any} item - Item to compare
 * @returns {boolean}
 */
