
export class AdversaryIndex {
    constructor() {
        makeIndex(adversaries, 'adv');
    }
}

export class Adversary {
    /**
     * Build an Adversary object from the data source.
     * @param {import("../data/typedef.mjs").AdversaryDataModel} data 
     */
    constructor(data) {
        this.adv = data.adv;
        this.nickname = data.nickname;
        this.fullname = data.fullname;
        this.htmlname = data.htmlname;
        this.diff = data.diff;
        this.set = data.set;

        this.levels = data.levels.map(x => new Level(x));
        this.levelByNumber = makeIndex(this.levels, 'lvl');

        this.effects = data.effects.map(x => new Effect(x));
    }


}

function makeIndex(array, indexProperty) {
    const obj = {};
    for (const a of array) {
        const key = a[indexProperty];
        obj[key] = a;
    }
    return obj;
}


export class Level {
    /**
     * 
     * @param {import("../data/typedef.mjs").AdversaryLeveDataModel} data 
     */
    constructor(data) {
        this.lvl = data.lvl;

    }
}

export class Effect {
    /**
     * 
     * @param {import("../data/typedef.mjs").AdversaryEffectDataModel} data 
     */
    constructor(data) {

    }
}
