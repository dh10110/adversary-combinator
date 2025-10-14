import { getNullAdversary, getAdversary } from "./dataAccess.mjs";

//#region V1 Selection

export class SelAdv {
    constructor() {
        this.adversary = null;
        this.level = 1;
    }
}

export class SelPair {
    constructor() {
        this.leader = new SelAdv();
        this.follow = new SelAdv();
    }
}

//#endregion


//#region V2 Selection

/**
 * A single selected adversary.
 * @prop {number} lvl - Level of the selected adversary
 * @prop {string} adv - Selected adversary code
 * @prop {import("../data/typedef.mjs").AdversaryDataModel} - Selected adversary objecy
 */
export class SelectedAdversary {
    constructor() {
        this.lvl = 1;
        setNullAdversary(this);
    }

    /**
     * Set the selected adversary.
     * @param {string | import("../data/typedef.mjs").AdversaryDataModel} adv 
     */
    setAdversary(adv) {
        //Is this clearing the selection?
        if (!adv) {
            setNullAdversary(this);
            return;
        }

        //Did we get an Adversary object?
        if (adv.adv) {
            this.adversary = adv;
            this.adv = adv.adv;
            return;
        }

        //Lookup by Code
        const adversary = getAdversary(adv);
        if (!adversary) {
            setNullAdversary(this);
            return;
        }

        this.adv = adversary.adv;
        this.adversary = adversary;
    }

    isSelected() {
        return this.adv !== null;
    }

    getDifficulty() {
        if (!this.adversary) { return 0; }
        if (!this.lvl) { return this.adversary.diff; }
        const level = this.adversary.levels.find(x => x.lvl === this.lvl);
        return level && level.diff || this.adversary.diff;
    }

    getSummaryTitle() {
        if (this.adv === null) {
            return `<b>${this.adversary.fullname}</b>`;
        } else {
            return `<b>${this.adversary.nickname} ${this.lvl}</b>`;
        }
    }
}

function setNullAdversary(sel) {
    sel.adv = null;
    sel.adversary = getNullAdversary();
}


/**
 * Pair of selected adversaries.
 * @prop {SelectedAdversary} leading
 * @prop {SelectedAdversary} supporting
 */
export class SelectedAdversaries {
    constructor() {
        this.leading = new SelectedAdversary();
        this.supporting = new SelectedAdversary();
    }

    /**
     * Sets one of the adversaries.
     * @param {string | import("../data/typedef.mjs").AdversaryDataModel} adv 
     * @param {bool} isSupport 
     */
    setAdversary(adv, isSupport) {
        if (isSupport) {
            this.supporting.setAdversary(adv);
        } else {
            this.leading.setAdversary(adv);
        }
    }

    computeDifficulty() {
        let diffLead = this.leading.getDifficulty();
        let diffSupport = this.supporting.getDifficulty();

        let [min, max] = minmax(diffLead, diffSupport);
        if (min === 0) { return max; } //shortcut

        const lb = max + Math.round(min * 0.5);
        const ub = max + Math.round(min * 0.75);
        
        if (lb === ub) { return lb; } //exact
        return `${lb}-${ub}`; //range
    }

    isMultiAdversary() {
        return this.leading.isSelected()
            && this.supporting.isSelected();
    }

    getSummaryTitle() {
        var sb = [];
        sb.push(this.leading.getSummaryTitle());
        if (this.supporting.isSelected()) {
            sb.push(this.supporting.getSummaryTitle());
        }
        sb.push(`<span>Difficulty ${this.computeDifficulty()}</span>`);
        return sb.join(' · ');
    }
}

function minmax(value1, value2) {
    if (value1 > value2) { return [value2, value1]; }
    return [value1, value2];
}

//#endregion
