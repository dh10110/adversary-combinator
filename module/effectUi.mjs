import officialData from "../data/official.json" with { type: "json" };
import { enhanceGameText } from "./gameText.mjs";
import { buildInvaderDeck, InvaderDeck } from "./invDeck.mjs";
import { SelAdv, SelPair } from "./models.mjs";
import { buildTimingTree, TimingPeriod } from "./timing.mjs";

/**
 * Simplified Helper to create an HTML Element
 * @param {string} tag - Tag of element to create
 * @param {string} htmlContent - HTML to put in created element
 * @param {string | string[]} classes - Class name(s) to apply to created element
 * @returns {HTMLElement} Created HTML Element
 */
export function makeElement(tag, htmlContent, classes) {
    const e = document.createElement(tag);
    e.innerHTML = htmlContent;
    if (classes) {
        if (Array.isArray(classes)) { 
            e.classList.add(...classes);
        } else {
            e.classList.add(classes);
        }
    }
    return e;
}

/**
 * Make an HTML Element for an Adversary Effect
 * @param {import('../data/typedef.mjs').AdversaryEffectDataModel} e 
 * @param {SelAdv} follow 
 * @returns {HTMLElement} Created HTML Element
 */
export function makeEffectElement(e, follow) {
    const html = `
<article data-ref="${e.ref}" class="adversary-effect">
    <span class="altag">
        <span class="altag_flag" style="--flag-bg: url('./img/flag-svg/${e.adv}.svg')"></span>
        <output class="altag_level">${e.lvl}</output>
    </span>
    <div class="effect-detail effect-type-${e.type}">
        <div class="effect-name">
            ${e.type === 'loss' ? "Loss Condition" : ""}
            ${e.type === 'esc' ? "Escalation " + (e.adv === (follow && follow.adv||'') ? "Ⅲ" : "<img class='icon' src='./img/icon/Escalation.svg'>") : ""}
        </div>
        <div>
            <output class="effect-name">${e.name}</output>
            <output class="effect-text">${enhanceText(e.text)}</output>
            <output class="effect-xtext">${enhanceText(e.xtext)}</output>
        </div>
    </div>
</article>
    `;
    return makeElement('li', html);
}

/**
 * Make an HTML Element to output the Fear Deck
 * @param {FearArray} fear 
 * @returns {HTMLElement} Created HTML Element
 */
function makeFearElement(fear) {
    const html = `
<article data-ref="fear" class="adversary-effect">
    <span class="">
        Fear
    </span>
    <div class="effect-detail">
        <div class="fear-deck">
            ${fear[0]}
            <img class="tl" src="./img/tl2.svg" alt="Terror Level 2 Divider" title="Terror Level 2 Divider" />
            ${fear[1]}
            <img class="tl" src="./img/tl3.svg" alt="Terror Level 3 Divider" title="Terror Level 3 Divider" />
            ${fear[2]}
        </div>
    </div>
</article>
    `;
    return makeElement('li', html);
}

/**
 * Make an HTML Element to output the Invader Deck
 * @param {InvaderDeck} invDeck 
 * @returns {HTMLElement} Created HTML Element
 */
function makeInvaderDeckElement(invDeck) {
    const sb = [];
    const where = [];
    const exclude = [...invDeck.toExclude];

    let prior = null;

    for (const card of invDeck.deck) {
        if (prior && prior.s !== card.s) {
            sb.push('·');
        }
        sb.push(card.n || card.s);
        if (card.n) {
            where.push(`${card.n} is the ${card.t} card`);
            const i = exclude.findIndex(c => c.n === card.n);
            if (i >= 0) { exclude.splice(i, 1); }
        }
        prior = card;
    }
    if (where.length > 0) {
        sb.push(`; where ${where.join(', ')}`);
    }
    if (exclude.length > 0) {
        sb.push(`; exclude ${exclude.map(c => c.t).join(', ')}`);
    }
    if (invDeck.isDefault) {
        sb.push(' <i>(Default)</i>');
    }

    const html = `
<article data-ref="invader" class="adversary-effect">
    <span class="">
        Inv
    </span>
    <div class="effect-detail">
        <div class="invader-deck">
            ${sb.join('')}
        </div>
    </div>
</article>
    `;
    return makeElement('li', html);
}


function enhanceText(text) {
    return enhanceGameText(text);
}

/**
 * Add 2 fear arrays to the default
 * @param {FearArray} l - leader's fear array
 * @param {FearArray} f - follower's fear array
 * @returns {FearArray}
 */
function addFear(l, f) {
    const fear = [3, 3, 3];
    if (l && l.length === 3) {
        fear[0] += l[0];
        fear[1] += l[1];
        fear[2] += l[2];
    }
    if (f && f.length === 3) {
        fear[0] += f[0];
        fear[1] += f[1];
        fear[2] += f[2];
    }
    return fear;
}


/**
 * Combine the selected adversaries
 * @param {SelPair} selection 
 */
export function combineAdversaries(selection) {
    
    //TODO: Handle weird input

    //Put all the effects in Gameplay Timing Order

    const timingTree = buildTimingTree();
    const leader = officialData.filter(x => x.adv === selection.leader.adversary)[0] || { effects: [] };
    const follow = officialData.filter(x => x.adv === selection.follow.adversary)[0] || { effects: [] };

    //Add all the effects in the order of leader, then follower,
    //   except for invader deck changes where the leader changes are done last
    const leaderInv = [];
    leader.effects.forEach(e => {
        if (e.lvl > selection.leader.level) { return; }
        if (e.inv) { leaderInv.push(e); return; }
        timingTree.addEffect(e);
    });
    follow.effects.forEach(e => {
        if (e.lvl > selection.follow.level) { return; }
        timingTree.addEffect(e);
    })
    leaderInv.forEach(e => {
        timingTree.addEffect(e);
    });

    //Clear the holders
    const $setup = document.querySelector('#setup-effects > ul');
    const $play = document.querySelector('#play-effects > ul');
    $setup.innerHTML = '';
    $play.innerHTML = '';

    //Invader Deck
    var invDeck = makeInvaderDeck(timingTree);
    $setup.appendChild(makeInvaderDeckElement(invDeck));

    //Level for Fear
    const leaderLevel = (leader.levels || []).filter(x => x.lvl === selection.leader.level)[0] || {};
    const followLevel = (follow.levels || []).filter(x => x.lvl === selection.follow.level)[0] || {};
    //Fear Deck
    const fear = addFear(leaderLevel.fear, followLevel.fear);
    $setup.appendChild(makeFearElement(fear));

    //Other Effects
    showEffects(timingTree.children['1000'], $setup, follow);
    showEffects(timingTree.children['2000'], $play, follow);
}

/**
 * Show all the effects in a Timing Period
 * @param {TimingPeriod} period - Timing Period to show
 * @param {Element} $box - Element to fill
 * @param {SelAdv} follow - The follow Adversary (to handle Escalation properly)
 */
function showEffects(period, $box, follow) {
    const effects = Array.from(period.iterateEffects());
    if (effects.length > 0) {
        $box.appendChild(makeElement('h3', period.title, 'effect-header'));
        effects.forEach(e => $box.appendChild(makeEffectElement(e, follow)));
    }

    for (const key in period.children) {
        showEffects(period.children[key], $box, follow);
    }
}

/**
 * Make the invader deck from the effects in the timing tree
 * @param {TimingPeriod} timingTree - Root of the gameplay timing tree
 * @returns {InvaderDeck}
 */
function makeInvaderDeck(timingTree) {
    const invCmds = [];
    for (const effect of timingTree.iterateEffectsRecursive()) {
        if (effect.inv) { invCmds.push(...effect.inv); }
    }
    return buildInvaderDeck(invCmds);
}



/**
 * @typedef {import("../data/typedef.mjs").FearArray} FearArray
 */
