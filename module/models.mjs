
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


export class SelectedAdversary {
    constructor() {
        this.adv = null;
        this.level = 1;
    }

    isSelected() {
        return this.adv !== null;
    }
}

export class SelectedAdversaries {
    constructor() {
        this.leading = new SelectedAdversary();
        this.supporting = new SelectedAdversary();
    }

    setAdversary(adv, isSupport) {

    }

    computeDifficulty() {

    }

    isMultiAdversary() {

    }

    * iterateAdversaries() {
        
    }
}
