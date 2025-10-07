
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
     * Does nothing if this is not in a list already.
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
     * Does nothing if this is not in a list already.
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
     * Does nothing if this is not in a list already.
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
     * Does nothing if this is not in a list already.
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
        let cur = this;
        while (!cur.sentinel) {
            yield cur;
            cur = cur[dir];
        }
    }
}

/**
 * Ensures a {@link LinkedListNode}: returns the passed item if it already is one, or wraps in a new one if not.
 * @param {any} item - item to ensure is a {@link LinkedListNode}
 * @returns {LinkedListNode} 
 */
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
