import { LinkedList, LinkedListNode } from "./linkedList.mjs";

/**
 * Extension of Array to simplify some Invader Deck steps.
 * @extends {Array}
 * @deprecated
 */
class DeckArray extends Array {
    /**
     * Create a {@link DeckArray}.
     * @param  {...CardRef} items Initial items for the array.
     */
    constructor(...items) { super(...items); }

    /** Shallow copy of this {@link DeckArray} */
    clone() { return new DeckArray(...this); }

    /**
     * Search from the top to find the nth occurence of a card of a particular stage.
     * @param {import("../data/typedef.mjs").InvaderStage} stage Stage of the card to find (1,2,3) or 0 for any stage.
     * @param {number} ordinal Ordinal index of the card of that stage to find. Negative to search from the bottom using {@link lastIndexOf}.
     * @returns {number?} Index of the found card, or null if not found.
     * @example
     * //3nd Stage II
     * indexOf(2, 3)
     * @example
     * //last Stage I
     * indexOf(1, -1)
     * @example
     * //5th card of any stage
     * indexOf(0, 5)
     */
    indexOf(stage, ordinal) {
        if (ordinal < 0) return this.lastIndexOf(stage, -ordinal);

        let counter  = 0;
        for (let i = 0; i < this.length; i += 1) {
            if (stage === 0 || stage === this[i].s) {
                counter += 1;
                if (counter == ordinal) { return i; }
            }
        }
        //ran out of cards before reaching ordinal
        return null;
    }
    
    /**
     * Search from the bottom to find the nth occurence of a card of a particular stage.
     * It is generally expected to call {@link indexOf} with a negative ordinal instead of calling this method directly.
     * @param {import("../data/typedef.mjs").InvaderStage} stage Stage of the card to find (1,2,3) or 0 for any stage.
     * @param {number} ordinal Ordinal index of the card of that stage to find. Negative to search from the top using {@link indexOf}.
     * @returns {number?} Index of the found card, or null if not found.
     * @example
     * //last Stage I
     * lastIndexOf(1, 1)
     * @example
     * //3nd Stage II
     * lastIndexOf(2, -3)
     */
    lastIndexOf(stage, ordinal) {
        if (ordinal < 0) return this.indexOf(stage, -ordinal);

        let counter  = 0;
        for (let i = this.length - 1; i >= 0; i -= 1) {
            if (stage === 0 || stage === this[i].s) {
                counter += 1;
                if (counter == ordinal) { return i; }
            }
        }
        //ran out of cards before reaching ordinal
        return null;
    }

    /**
     * Uses a provided query object to try to locate a particular card.
     * @param {import("../data/typedef.mjs").InvCmdQuery} query - card to find in deck or specials
     * @param {number} refIndex - index reference passed by containing forEach
     * @returns {LocateResult}
     */
    locate(query, refIndex) {
        if (!query) {
            return {spec:false};
        } else if (query == '?') {
            return {spec:true, i:refIndex, c:this[refIndex]};
        } else if (Array.isArray(query)) {
            let [stage, ordinal] = query;
            let index = this.indexOf(stage, ordinal);
            if (index === null) { return {spec:true, nf: true}; }
            return {spec:true, i:index, c:this[index]};
        } else {
            let card = namedCardDefs[query];
            if (!card) { return {spec:true, nf:true}; }
            return {spec:true, i:null, c:card};
        }
    }

    /**
     * Delete a card from the array, at provided index.
     * @param {number} index Index to delete card from
     */
    deleteAt(index) {
        index = clamp(0, index, this.length - 1);
        this.splice(index, 1);
    }

    /**
     * Insert a card to the array, at provided index.
     * @param {number} index Index to insert at
     * @param {CardRef} card Card to insert
     */
    insertAt(index, card) {
        index = clamp(0, index, this.length);
        this.splice(index, 0, card);
    }
}

/**
 * Class to encapsulate modifications to the Invader Deck
 * @deprecated
 */
export class InvaderDeck {
    /**
     * Create a new {@link InvaderDeck} with the default deck order.
     */
    constructor() {
        /**
         * The deck of invader cards 
         * @type {DeckArray}
         */
        this.deck = new DeckArray(...deckBuilder());
        /**
         * list of special cards to exclude
         * @type {CardRef[]}
         */
        this.toExclude = [];
        /**
         * flag to indicate if the deck is in the default order
         * @type {boolean} 
         */
        this.isDefault = true;
    }

    /**
     * Execute an invader deck modificaton command on this deck.
     * @param {import("../data/typedef.mjs").InvCmd} cmd - Invader Deck modification command
     * @param {number | undefined} refIndex - Reference index from forEach
     * @returns {number | boolean} - true/false for single command success; or count of successes of forEach
     */
    doCommand(cmd, refIndex) {
        //exclude
        if (cmd.x) {
            this.toExclude.push(namedCardDefs[cmd.x]);
        }

        //each
        if (cmd.e) {
            let nOk = 0;
            for (let i = 0; i < this.deck.length; ++i) {
                if (cmd.e === 0 || cmd.e === this.deck[i].s) {
                    nOk += +this.doCommand(cmd.$, i);
                }
            }
            return nOk;
        }

        //Make changes on a temp copy; only finalize if whole command worked
        const newDeck = this.deck.clone();

        //m = move from: letter=special, array=[stage, index], index=-1 => bottom
        const m = newDeck.locate(cmd.m, refIndex);
        if (m.spec && m.nf) { return false; }
        if (m.spec && m.i !== null) { newDeck.deleteAt(m.i); }
        
        //r = replace (can replace with nothing for remove)
        const r = newDeck.locate(cmd.r, refIndex);
        if (r.spec && r.nf) { return false; }
        if (r.spec && r.i !== null) {
            newDeck.deleteAt(r.i);
            if (m.spec && m.c) { newDeck.insertAt(r.i, m.c); }
            this.deck = newDeck;
            this.isDefault = false;
            return true;
        }

        if (!m.spec) { return false; }

        //b = insert below
        const b = newDeck.locate(cmd.b, refIndex);
        if (b.spec && b.nf) { return false; }
        if (b.spec && b.i !== null) {
            newDeck.insertAt(b.i + 1, m.c);
            this.deck = newDeck;
            this.isDefault = false;
            return true;
        }

        //d = delta (move relative to m)
        if (cmd.d) {
            newDeck.insertAt(m.i + cmd.d, m.c);
            this.deck = newDeck;
            this.isDefault = false;
            return true;
        }
    }
}

/**
 * Linked-List based Invader Deck for handling adversary changes.
 */
export class InvaderDeckList {
    constructor(namedCards) {
        this.deck = new LinkedList(...deckBuilder());
        this.toExclude = [];
        this.isDefault = true;
        this.namedCardNodes = makeNamedCardNodes(namedCards);
    }

    /**
     * Uses the provided query to try to locate the node containing a particular card
     * @param {import("../data/typedef.mjs").InvCmdQuery} query 
     * @param {LinkedListNode} refNode - reference node from each loop
     * @returns {LocateNodeResult}
     */
    locate(query, refNode) {
        if (!query) {
            //query not specified
            return {spec:false, node:null};
        } else if (query === '?') {
            //query is reference node
            return {spec:true, node:refNode};
        } else if (Array.isArray(query)) {
            //query is an 'nth stage' search
            let [stage, nth] = query;
            let fn = stageCompareFns[stage];
            let n = Math.abs(nth);
            let nodes = this.deck.iterateNodes(nth)
                .filter(node => fn(node.item))
                .drop(n - 1);
            let result = nodes.next();
            let found = result.value || null;
            if (found === null) { return {spec:true, node:null}; }
            return {spec:true, node:found};
        } else {
            //query is a named card
            let found = this.namedCardNodes[query];
            if (found === null) { return {spec:true, node:null}; }
            return {spec:true, node:found};
        }
    }

    doCommand(cmd, refNode) {
        //exclude
        if (cmd.x) {
            this.toExclude.push(namedCardDefs[cmd.x]);
            this.isDefault = false;
        }

        //each
        if (cmd.e) {
            let nOk = 0;
            const fn = stageCompareFns[cmd.e];
            if (!fn) { return false; }
            const matchedNodes = [...this.deck.iterateNodes(1).filter(node => fn(node.item))];
            for (const n of matchedNodes) {
                nOk += this.doCommand(cmd.$, n);
            }
            return nOk;
        }

        //Remove
        const locRemove = this.locate(cmd.r, refNode);
        if (locRemove.spec) {
            if (!locRemove.node) { return false; }
            locRemove.node.remove();
            this.isDefault = false;
            return true;
        }

        //Moved node (maybe reMoved?)
        const locMove = this.locate(cmd.m, refNode);
        if (locMove.spec && !locMove.node) { return false; }

        //rePlace?
        const locPlace = this.locate(cmd.p, refNode);
        if (locPlace.spec) {
            if (!locPlace.node) { return false; }
            if (!locMove.node) { return false; } //p needs m
            locPlace.node.replace(locMove.node);
            this.isDefault = false;
            return true;
        }

        //insert Below?
        const locBelow = this.locate(cmd.b, refNode);
        if (locBelow.spec) {
            if (!locBelow.node) { return false; }
            if (!locMove.node) { return false; } //b needs m
            locBelow.node.addAfter(locMove.node);
            this.isDefault = false;
            return true;
        }

        //move Up?
        if (cmd.u) {
            const u = +cmd.u; //ensure number
            if (u <= 0) { return false; }
            if (!locMove.node) { return false; } //u needs m
            const iter = locMove.node.iterate(-1).drop(u);
            const above = iter.next().value;
            if (!above) { return false; }
            above.addBefore(locMove.node);
            this.isDefault = false;
            return true;
        }

        //move down/delta
        if (cmd.d) {
            const d = +cmd.d; //ensure number
            if (d !== 0) { return false; }
            const relative = locMove.node.findNext(cmpAnyStage, d + Math.sign(d)); //+- 1 b/c 1 finds same node
            if (!relative) { return false; }
            if (d < 0) {
                //move up
                relative.insertNodeBefore(locMove.node);
            } else {
                //move down
                relative.insertNodeAfter(locMove.node);
            }
            return true;
        }

        //just m => reMove
        locMove.node.remove();
        this.isDefault = false;
        return true;

    }
}

function cmpAnyStage(card) { return !!card.s; }
function cmpStage1(card) { return card.s === 1; }
function cmpStage2(card) { return card.s === 2; }
function cmpStage3(card) { return card.s === 3; }
const stageCompareFns = [
    cmpAnyStage,
    cmpStage1,
    cmpStage2,
    cmpStage3
];



/**
 * Sets an upper and lower bound to a value.
 * @param {*} min Minimum value
 * @param {*} value Preferred calue
 * @param {*} max Maximum value
 * @returns
 */
function clamp(min, value, max) {
    return value < min ? min
        : value > max ? max
        : value;
}

/**
 * Builder function to make default invader deck with indexes for debugging
 * @yields {CardRef}
 */
function * deckBuilder() {
    //let j = 0; //whole deck index
    for (const s of [1, 2, 3]) { //stages 1,2,3
        let n = 2 + s; //does 3×1, 4×2, 5×3
        for (let i = 0; i < n; ++i) {
            yield {s: s, i: 10*s + i + 1};
        }
    }
}

/**
 * Default deck order
 * @type {CardRef[]}
 */
const defaultDeck = [{s:1},{s:1},{s:1}, {s:2},{s:2},{s:2},{s:2}, {s:3},{s:3},{s:3},{s:3},{s:3}];

/**
 * Special Cards
 * @type {Object.<string, CardRef>}
 */
const namedCardDefs = {
    /**
     * Coastal Lands Invader Card
     * @type {CardRef}
     */
    C: {n: 'C', s: 2, t:'Coastal Lands'},
    /**
     * Salt Deposits Card - Habsburg Mining Expedition
     * @type {CardRef}
     */
    S: {n: 'S', s: 2, t:'Salt Deposits'},
    /**
     * Habsburg Reminder Card - Habsburg Livestock Colony
     * @type {CardRef}
     */
    H: {n: 'H', t:'Habsburg Reminder Card'}
};

function makeNamedCardNodes(namedCards) {
    const namedNodes = {};
    namedNodes.C = new LinkedListNode(namedCardDefs.C);
    for (const card of namedCards) {
        namedNodes[card.n] = new LinkedListNode(card);
    }
    return namedNodes;
}

/**
 * Build the Invader Deck with the provided modification commands.
 * @param {import("../data/typedef.mjs").InvCmd[]} invCmds 
 * @returns {InvaderDeck}
 */
export function buildInvaderDeck(invCmds) {
    const invDeck = new InvaderDeck();
    let changes = 0;
    for (const cmd of invCmds) {
        changes += invDeck.doCommand(cmd);
    }
    return invDeck;
}


/**
 * Result from the {@link InvaderDeck}.locate function.
 * @typedef {Object} LocateResult
 * @property {boolean} spec - true if caller specified a query; other properties omitted if spec = false.
 * @property {boolean} nf - true if no matching card found
 * @property {number?} i - Index of card in deck (if found in deck)
 * @property {CardRef?} c - A card, either found in deck, or a special.
 */


/**
 * Result from the {@link InvaderDeckList} locate function.
 * @typedef {Object} LocateNodeResult
 * @prop {boolean} spec - true if caller specified this query
 * @prop {LinkedListNode?} node - Result node, if found
 */


/** 
 * Card Reference in the invader deck.
 * @typedef {Object} CardRef
 * @property {import("../data/typedef.mjs").InvaderStage | undefined} s - stage of the invader card; omitted if card doesn't have a stage.
 * @property {number | undefined} i - original index of the card in the deck
 * @property {string | undefined} n - single character name of card; omitted if not named
 * @property {string | undefined} t - title of named card
 */
