
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
