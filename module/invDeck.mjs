import { LinkedList, LinkedListNode } from "./linkedList.mjs";

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
            const [stage, nth] = query;
            const compareNodeStage = nodeStageComapareFns[stage];
            let n = Math.abs(nth);
            let nodes = this.deck.iterateNodes(nth)
                .filter(compareNodeStage).drop(n - 1);
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

    /**
     * Executes an invader deck modification command.
     * @param {import("../data/typedef.mjs").InvCmd} cmd - Command to execute.
     * @param {LinkedListNode?} refNode - Reference Node passed from 'each' loop.
     * @returns {boolean|number} - true/false if single command is applied or not; or number of successful subcommands for an 'each' loop.
     */
    doCommand(cmd, refNode) {
        //exclude
        if (cmd.x) {
            this.toExclude.push(namedCardDefs[cmd.x]);
            this.isDefault = false;
        }

        //each
        if (cmd.e) {
            let nOk = 0;
            const compareNodeStage = nodeStageComapareFns[cmd.e];
            if (!compareNodeStage) { return false; }
            const matchedNodes = [...this.deck.iterateNodes(1).filter(compareNodeStage)];
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

        //mode down/up
        if (cmd.d || cmd.u) {
            const delta = Number(cmd.d) || -Number(cmd.u) || 0;
            if (!delta) { return false; }
            if (!locMove.node) { return false; } //u/d needs m
            const [dir, n] = [Math.sign(delta), Math.abs(delta)];
            const iter = locMove.node.iterate(dir).drop(n);
            const ref = iter.next().value;
            if (!ref) { return false; }
            if (delta < 0) { ref.addBefore(locMove.node); }
            else { ref.addAfter(locMove.node); }
            this.isDefault = false;
            return true;
        }
/*
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
*/

        //just m => reMove
        locMove.node.remove();
        this.isDefault = false;
        return true;

    }
}

/**
 * Card Stage Compare Function (any stage).
 * @param {CardRef} card 
 * @returns {boolean} true if card has any stage.
 */
function cmpAnyStage(card) { return !!card.s; }
/**
 * Card Stage Compare Function (stage 1).
 * @param {CardRef} card 
 * @returns {boolean} true if card is stage 1.
 */
function cmpStage1(card) { return card.s === 1; }
/**
 * Card Stage Compare Function (stage 2).
 * @param {CardRef} card 
 * @returns {boolean} true if card is stage 2.
 */
function cmpStage2(card) { return card.s === 2; }
/**
 * Card Stage Compare Function (stage 3).
 * @param {CardRef} card 
 * @returns {boolean} true if card is stage 3.
 */
function cmpStage3(card) { return card.s === 3; }
/**
 * Array of card stage compare functions corresponding to the possible {@link InvCmdQuery} stage match (1, 2, or 3, or 0 for any stage).
 */
const stageCompareFns = [
    cmpAnyStage,
    cmpStage1,
    cmpStage2,
    cmpStage3
];
/**
 * Array of functions that take a {@link LinkedListNode}, and evalute if its item ({@link CardRef}) matches the search stage (1, 2, or 3, or 0 for any stage).
 * @type {Array.<function(LinkedListNode): boolean>}
 */
const nodeStageComapareFns = stageCompareFns.map(fnCard => node => fnCard(node.item));


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
};

/**
 * Make a dictionary of named cards with the standard Coastal Lands card, and any specified by the Adversary.
 * @param {Iterable.<CardRef>} namedCards - Named cards specified by the adversary.
 * @returns {Object.<string, LinkedListNode>}
 */
function makeNamedCardNodes(namedCards) {
    const namedNodes = {};
    namedNodes.C = new LinkedListNode(namedCardDefs.C);
    for (const card of namedCards) {
        namedNodes[card.n] = new LinkedListNode(card);
    }
    return namedNodes;
}


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
 * @property {string | undefined} t - title of named card; omitted if not named
 */
