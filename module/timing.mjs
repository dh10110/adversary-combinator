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
        const path = splitOrder(effect.order);
        if (!/[12589]/.test(path[3])) { path[3] = '5'; }
        return addEffectByPath(path, effect);
    }

    addEffectByPath(path, effect) {
        if (path.length == 1) {
            return this.effects[path[0]].push(effect);
        }
        const child = this.children[path[0]];
        if (!child) throw new Error("Missing Timing Period " + path[0]);
        return child.addEffectByPath(path.slice(1), effect);
    }
}

function splitOrder(order) {
    const path = [];
    const digits = order.toString().split('');
    if (digits.length !== 4) throw new Error("Expecting 4-digit number");
    const prefix = '';
    for (let i = 0; i < 4; i += 1) {
        var d = digits[i];
        if (d === '0') { return path; }
        prefix += d;
        path.push(`${prefix}${'0'.repeat(3 - i)}`);
    }
    return path;
}

export function buildTimingTree() {
    const root = new TimingPeriod(0, "Gameplay");
    timingData.forEach(root.addPeriod);
    return root;
}
