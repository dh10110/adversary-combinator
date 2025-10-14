import { enhanceGameText } from "./gameText.mjs";
import { InvaderDeckList } from "./invDeck.mjs";
import { SelAdv, SelectedAdversaries } from "./models.mjs";
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
 * @param {import('../data/typedef.mjs').AdversaryEffectDataModel} e - effect
 * @param {SelectedAdversaries} selection - Selected Adversaries (modifies display of escalation)
 * @returns {HTMLElement} Created HTML Element
 */
export function makeEffectElement(e, selection) {
    const supporting = selection.supporting;
    const isSupporting = e.adv === (supporting && supporting.adv || '');
    const effSrc = isSupporting ? 'S' : 'L';
    const html = `
    <span class="altag">
        <span class="altag_flag" style="--flag-bg: url('./img/flag-svg/${e.adv}.svg')"></span>
        <output class="altag_level">${e.lvl}</output>
    </span>
    <div class="effect-detail effect-type-${e.type} effect-src-${effSrc}">
        <div class="effect-name">
            ${e.type === 'loss' ? "Loss Condition" : ""}
            ${e.type === 'esc' ? "Escalation " + (isSupporting ? "Ⅲ" : "<img class='icon' src='./img/icon/Escalation.svg'>") : ""}
        </div>
        <div>
            <span class="effect-name">${e.name}</span>
            <span class="effect-text">${enhanceText(e.text)}</span>
            <span class="effect-xtext">${enhanceText(e.xtext)}</span>
            <span class="effect-xtext keep-together">${enhanceText(e.itext)}</span>
        </div>
    </div>
    `;
    const elem = makeElement('article', html, 'adversary-effect');
    elem.dataset.ref = e.ref;
    return elem;
}

/**
 * Make an HTML Element to output the Fear Deck
 * @param {FearArray} fear 
 * @returns {HTMLElement} Created HTML Element
 */
function makeFearElement(fear) {
    const html = `
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
    `;
    const elem = makeElement('article', html, 'adversary-effect');
    elem.dataset.ref = 'fear';
    return elem;
}

/**
 * Make an HTML Element to output the Invader Deck
 * @param {InvaderDeckList} invDeck 
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
    <span class="">
        Inv
    </span>
    <div class="effect-detail">
        <div class="invader-deck">
            ${sb.join('')}
        </div>
    </div>
    `;
    const elem = makeElement('article', html, 'adversary-effect');
    elem.dataset.ref = 'invader';
    return elem;
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
 * @param {SelectedAdversaries} selection 
 */
export function combineAdversaries(selection) {

    //Put all the effects in Gameplay Timing Order
    const timingTree = buildTimingTree();
    const leading = selection.leading.adversary;
    const supporting = selection.supporting.adversary;

    //Add all the effects in the order of leader, then follower,
    //   except for invader deck changes where the leader changes are done last
    const leaderInv = [];
    leading.effects.forEach(e => {
        if (e.lvl > selection.leading.lvl) { return; }
        if (e.inv) { leaderInv.push(e); return; }
        timingTree.addEffect(e);
    });
    supporting.effects.forEach(e => {
        if (e.lvl > selection.supporting.lvl) { return; }
        timingTree.addEffect(e);
    })
    leaderInv.forEach(e => {
        timingTree.addEffect(e);
    });

    //Clear the holders
    const $setup = document.querySelector('#setup-effects > [data-container]');
    const $play = document.querySelector('#play-effects > [data-container]');
    $setup.innerHTML = '';
    $play.innerHTML = '';

    //Invader Deck
    const addedCards = [...leading.invs || [], ...supporting.invs || []];
    var invDeck = makeInvaderDeck(timingTree, addedCards);
    $setup.appendChild(makeInvaderDeckElement(invDeck));

    //Level for Fear
    const leadingLevel = (leading.levels || []).filter(x => x.lvl === selection.leading.lvl)[0] || {};
    const supportingLevel = (supporting.levels || []).filter(x => x.lvl === selection.supporting.lvl)[0] || {};
    //Fear Deck
    const fear = addFear(leadingLevel.fear, supportingLevel.fear);
    $setup.appendChild(makeFearElement(fear));

    //Other Effects
    showEffects(timingTree.children['1000'], $setup, selection);
    showEffects(timingTree.children['2000'], $play, selection);

    //Show Effects
    document.getElementById('play-effects').style.display = null;
    document.getElementById('setup-effects').style.display = null;
    //Close chooser
    const d = document.getElementById('chooser-page');
    d.open = null;
}

/**
 * Show all the effects in a Timing Period
 * @param {TimingPeriod} period - Timing Period to show
 * @param {Element} $box - Element to fill
 * @param {SelectedAdversaries} selection - the selected adversaries (modifies display of escalation, multi)
 */
function showEffects(period, $box, selection) {
    const isMulti = selection.isMultiAdversary();
    const effects = Array.from(period.iterateEffects(isMulti));
    if (effects.length > 0) {
        $box.appendChild(makeElement('h3', period.title, 'effect-header'));
        effects.forEach(e => $box.appendChild(makeEffectElement(e, selection)));
    }

    for (const key in period.children) {
        showEffects(period.children[key], $box, selection);
    }
}

/**
 * Make the invader deck from the effects in the timing tree
 * @param {TimingPeriod} timingTree - Root of the gameplay timing tree
 * @returns {InvaderDeck}
 */
function makeInvaderDeck(timingTree, namedCards = []) {
    const deck = new InvaderDeckList(namedCards);
    for (const effect of timingTree.iterateEffectsRecursive()) {
        if (effect.inv) {
            for (const invCmd of effect.inv) {
                deck.doCommand(invCmd);
            }
        }
    }
    return deck;
}



/**
 * @typedef {import("../data/typedef.mjs").FearArray} FearArray
 */
