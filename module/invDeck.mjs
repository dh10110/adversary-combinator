
class DeckArray extends Array {
    constructor(...items) { super(...items); }

    clone() { return new DeckArray(...this); }

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

    deleteAt(index) {
        index = clamp(0, index, this.length - 1);
        this.splice(index, 1);
    }

    insertAt(index, card) {
        index = clamp(0, index, this.length);
        this.splice(index, 0, card);
    }
}


export class InvaderDeck {
    constructor() {
        //this.deck = Array.from(defaultDeck);
        //this.deck = Array.from(deckBuilder());
        this.deck = new DeckArray(...deckBuilder());
        this.toExclude = [];
    }

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
            return true;
        }

        if (!m.spec) { return false; }

        //b = insert below
        const b = newDeck.locate(cmd.b, refIndex);
        if (b.spec && b.nf) { return false; }
        if (b.spec && b.i !== null) {
            newDeck.insertAt(b.i + 1, m.c);
            this.deck = newDeck;
            return true;
        }

        //d = delta (move relative to m)
        if (cmd.d) {
            newDeck.insertAt(m.i + cmd.d, m.c);
            this.deck = newDeck;
            return true;
        }
    }


}



function clamp(min, value, max) {
    return value < min ? min
        : value > max ? max
        : value;
}

function * deckBuilder() {
    let j = 0;
    for (const s of [1, 2, 3]) {
        let n = 2 + s;
        for (let i = 0; i < n; ++i) {
            yield {s: s, i: ++j};
        }
    }
}

const defaultDeck = [{s:1},{s:1},{s:1}, {s:2},{s:2},{s:2},{s:2}, {s:3},{s:3},{s:3},{s:3},{s:3}];
const specials = {
    C: {n: 'C', s: 2, t:'Coastal Lands'},
    S: {n: 'S', s: 2, t:'Salt Deposits'},
    H: {n: 'H', t:'Habsburg Reminder Card'}
};

export function buildInvaderDeck(invCmds) {
    const invDeck = new InvaderDeck();
    for (const cmd of invCmds) {
        invDeck.doCommand(cmd);
    }
    return invDeck;
}
