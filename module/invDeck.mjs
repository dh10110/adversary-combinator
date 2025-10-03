/**
 * Extension of Array to simplify some Invader Deck steps.
 * @extends {Array}
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
            let card = specials[query];
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
            this.toExclude.push(specials[cmd.x]);
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
    let j = 0; //whole deck index
    for (const s of [1, 2, 3]) { //stages 1,2,3
        let n = 2 + s; //does 3×1, 4×2, 5×3
        for (let i = 0; i < n; ++i) {
            yield {s: s, i: ++j};
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
 */
const specials = {
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
 * Card Reference in the invader deck.
 * @typedef {Object} CardRef
 * @property {import("../data/typedef.mjs").InvaderStage | undefined} s - stage of the invader card; omitted if card doesn't have a stage.
 * @property {number | undefined} i - original index of the card in the deck
 * @property {string | undefined} n - single character name of special card
 * @property {string | undefined} t - title of special card
 */
