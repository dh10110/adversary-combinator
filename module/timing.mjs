import timingData from "../data/timing.json" with { type: "json" };

/**
 * Timing modifiers used as keys for {@link TimingPeriod.effects}.
 * @readonly
 * @enum {string}
 */
export const TimingModifiers = {
    /** Modifier: Before the period starts */
    BEFORE: "1",
    /** Modifier: At the start of the period */
    ATSTART: "2",
    /** Modifier: Sometime during the period (default) */
    DURING: "5",
    /** Modifier: At the end of the period */
    ATEND: "8",
    /** Modifier: After the period ends */
    AFTER: "9"
}

/**
 * Class that represents a discrete timing period with the gameplay.
 * Can contain child timing periods, and a list of effects that occur in various parts of the period.
 * Keys for effects arrays are from {@link TimingModifiers}.
 */
export class TimingPeriod {
    /**
     * Create a timing period.
     * @param {number} order 4-digit timing period order number (ends in 0).
     * @param {string} title Title of the timing period.
     */
    constructor(order, title) {
        /** 4-digit order number for this timing period */
        this.order = order;
        /** Title of this timing period */
        this.title = title;
        /** Child timing periods of this timing period. Keys here should match the start of the order number
         * @type {Object.<string, TimingPeriod>} */
        this.children = {};
        /** Effects orccuring sometime during this timing period; different lists for each value in {@link TimingModifiers}.
         * @type {Object.<string, AdversaryEffectDataModel[]>} */
        this.effects = {
            /** Effects occuring before the this period starts
             * @type {AdversaryEffectDataModel[]} */
            "1": [],
            /** Effects occuring at the start of this period
             * @type {AdversaryEffectDataModel[]} */
            "2": [],
            /** Effects occuring during this period
             * @type {AdversaryEffectDataModel[]} */
            "5": [],
            /** Effects occuring at the end of this period
             * @type {AdversaryEffectDataModel[]} */
            "8": [],
            /** Effects occuring after the this period ends
             * @type {AdversaryEffectDataModel[]} */
            "9": []
        }
    }

    /**
     * Iterate the effects contained directly in this timing period.
     * @param {boolean} isMulti - include multiple adversary effects.
     * @yields {AdversaryEffectDataModel} - Next effect
     */
    * iterateEffects(isMulti) {
        for (const key in this.effects) {
            const arr = this.effects[key];
            for (let i = 0; i < arr.length; i += 1) {
                let eff = arr[i];
                if (isMulti || eff.type !== 'mult') {
                    yield arr[i];
                }
            }
        }
    }

    /**
     * Iterate the effects contained directly in this timing period,
     *    and all descendent timing periods.
     * @yields {AdversaryEffectDataModel} - Next effect
     */
    * iterateEffectsRecursive() {
        yield * this.iterateEffects();
        for (const childKey in this.children) {
            const child = this.children[childKey];
            yield * child.iterateEffectsRecursive();
        }
    }

    /**
     * Adds a period as a descendent to this timing period, based on its .order property.
     * @param {TimingPeriodDataModel} item Period data item to add.
     * @returns The added {@link TimingPeriod}.
     */
    addPeriod(item) {
        const path = splitOrder(item.order);
        return this.addPeriodByPath(path, item);
    }

    /**
     * Adds a period as a descendent to this timing period.
     * @param {string[]} path Array of keys to follow to add this period.
     * @param {TimingPeriodDataModel} item Period data item to add.
     * @returns The added {@link TimingPeriod}.
     */
    addPeriodByPath(path, item) {
        const child = this.children[path[0]];
        if (child) {
            return child.addPeriodByPath(path.slice(1), item);
        }
        const added = new TimingPeriod(item.order, item.title);
        this.children[path[0]] = added;
        return added;
    }

    /**
     * Adds an effect as a descendent to this timing period, based on its .order property.
     * If effect has an array for the .order, effect will be added on each path.
     * Existing effects with the matching .order and .repl (if any) will be replaced.
     * @param {*} effect Effect data item to add.
     * @returns The added effect(s).
     */
    addEffect(effect) {
        if (Array.isArray(effect.order)) {
            const added = [];
            effect.order.forEach(x => {
                const path = splitOrder(x, true);
                added.push(this.addEffectByPath(path, effect));
            });
            return added;
        }

        const path = splitOrder(effect.order, true);
        return this.addEffectByPath(path, effect);
    }

    /**
     * Adds an effect as a descendent to this timing period.
     * Existing effects with the same .order and .repl (if any) will be replaced.
     * @param {string[]} path Array of keys to follow to add this effect.
     * @param {AdversaryEffectDataModel} effect Effect data item to add.
     * @returns The added effect(s).
     */
    addEffectByPath(path, effect) {
        const key = path[0];
        if (path.length == 1) {
            if (effect.repl) {
                this.effects[key] = this.effects[key].filter(x => x.repl != effect.repl);
            }
            this.effects[key].push(effect);
            return effect;
        }
        const child = this.children[key];
        if (!child) throw new Error("Missing Timing Period " + key);
        return child.addEffectByPath(path.slice(1), effect);
    }
}

/**
 * Splits a 4 digit order into a path of keys for the timing tree
 * @example splitOrder(1100) => ['1000', '1100'] 
 * @example splitOrder(2581, true) => ['2000', '2500', '2580', '1']
 * @param {number} order The 4-digit order number
 * @param {boolean} forEffect This is being done for an effect's order number
 * @returns Array of order keys for the path in the timing tree
 */
function splitOrder(order, forEffect) {
    const path = [];
    const digits = order.toString().split('');
    if (digits.length !== 4)
        throw new Error("Expecting 4-digit number");

    let prefix = '';
    for (let i = 0; i <= 2; i += 1) {
        var d = digits[i];
        if (d === '0') { break; }
        prefix += d;
        path.push(`${prefix}${'0'.repeat(3 - i)}`);
    }
    if (forEffect) {
        //Effects have a final single digit key that defaults to 5
        const modif = /^[1289]$/.test(digits[3]) ? digits[3] : '5';
        path.push(modif);
    }
    return path;
}

/**
 * Build a tree of all gameplay timing periods.
 * @returns Empty {@link TimingPeriod} which is the root of the tree.
 */
export function buildTimingTree() {
    const root = new TimingPeriod(0, "Gameplay");
    timingData.forEach(x => root.addPeriod(x));
    return root;
}


/**
 * @typedef {import("../data/typedef.mjs").TimingPeriodDataModel} TimingPeriodDataModel
 */
/**
 * @typedef {import("../data/typedef.mjs").AdversaryEffectDataModel} AdversaryEffectDataModel
 */
