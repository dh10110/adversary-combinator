import adversaryData from "../data/adversaries.json" with { type: "json" };
import { Adversary } from "./adversaryModels.mjs";

export function readAllAdversaries() {
    const adversaries = adversaryData.map(x => new Adversary(x));
    return adversaries;
}

export function readAdversary(adv) {
    const matching = adversaryData.filter(x => x.adv === adv)
        .map(x => new Adversary(x));

    if (matching.length > 0) {
        return matching[0];
    }

    return null;
}


/**
 * Iterate all of the adversary data objects
 * @param {bool} includeNone - true to include the "No Adversary" placeholder
 * @returns {import("../data/typedef.mjs").AdversaryDataModel}
 */
export function * getAllAdversaries(includeNone) {
    if (includeNone) {
        yield getNullAdversary();
    }
    yield * adversaryData;
}

/**
 * Get a placeholder adversary object for "No Adversary"
 * @returns {import("../data/typedef.mjs").AdversaryDataModel}
 */
export function getNullAdversary() {
    return {
        adv: null,
        nickname: 'NONE',
        fullname: 'No Adversary',
        htmlname: '<b>No Adversary</b>',
        diff: 0,
        set: 'base',
        levels: [],
        effects: []
    }
}

function makeAdversaryIndex() {
    const idx = {};
    for (const a of getAllAdversaries()) {
        idx[a.adv] = a;
    }
    return idx;
}
const adversaryIndex = makeAdversaryIndex();
export function getAdversary(adv) {
    const a = adversaryIndex[adv];
    if (!a) return null;
    return a;
}
