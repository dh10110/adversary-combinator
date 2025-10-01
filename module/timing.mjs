import timingData from "../data/timing.json" with { type: "json" };

export const TimingModifiers = {
    BEFORE: "1",
    ATSTART: "2",
    DURING: "5",
    ATEND: "8",
    AFTER: "9"
}

export class TimingPeriod {
    constructor(order, title) {
        this.order = order;
        this.title = title;
        this.children = {};
        this.effects = {
            "1": [],
            "2": [],
            "5": [],
            "8": [],
            "9": []
        }
    }

    * iterateEffects() {
        for (const key in this.effects) {
            const arr = this.effects[key];
            for (let i = 0; i < arr.length; i += 1) {
                yield arr[i];
            }
        }
    }

    addPeriod(item) {
        const path = splitOrder(item.order);
        return this.addPeriodByPath(path, item);
    }

    addPeriodByPath(path, item) {
        const child = this.children[path[0]];
        if (child) {
            return child.addPeriodByPath(path.slice(1), item);
        }
        const added = new TimingPeriod(item.order, item.title);
        this.children[path[0]] = added;
        return added;
    }

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
 * 
 * @param {number} order 
 * @param {boolean} forEffect 
 * @returns 
 */
function splitOrder(order, forEffect) {
    const path = [];
    const digits = order.toString().split('');
    if (digits.length !== 4)
        throw new Error("Expecting 4-digit number");
    //const toLast = digits.findLastIndex(x => x !== '0');
    let prefix = '';
    for (let i = 0; i <= 2; i += 1) {
        var d = digits[i];
        if (d === '0') { break; }
        prefix += d;
        path.push(`${prefix}${'0'.repeat(3 - i)}`);
    }
    if (forEffect) {
        const modif = /^[1289]$/.test(digits[3]) ? digits[3] : '5';
        path.push(modif);
    }
    return path;
}

export function buildTimingTree() {
    const root = new TimingPeriod(0, "Gameplay");
    timingData.forEach(x => root.addPeriod(x));
    return root;
}
