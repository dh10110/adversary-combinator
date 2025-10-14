
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

    * effectsUpToLevel(lvl) {
        for (const eff of this.effects) {
            if (eff.lvl <= lvl) {
                yield lvl;
            }
        }
    }
}

export class Level {
    /**
     * 
     * @param {import("../data/typedef.mjs").AdversaryLevelDataModel} data 
     */
    constructor(data) {
        this.lvl = data.lvl;
        this.diff = data.diff;
        this.fear = data.fear;
    }
}

export class Effect {
    /**
     * 
     * @param {import("../data/typedef.mjs").AdversaryEffectDataModel} data 
     */
    constructor(data) {
        this.ref = data.ref;
        this.adv = data.adv;
        this.lvl = data.lvl;
        this.type = data.type;
        this.name = data.name;
        this.order = data.order;
        this.text = data.text;
        this.xtext = data.xtext;
        this.itext = data.itext;
        this.inv = data.inv;
        this.repl = data.repl;
    }
}
