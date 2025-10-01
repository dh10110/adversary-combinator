import officialData from "../data/official.json" with { type: "json" };
import { SelPair } from "./models.mjs";
import { buildTimingTree } from "./timing.mjs";

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

export function makeEffectElement(e, follow) {
    const html = `
<article data-ref="${e.ref}" class="adversary-effect">
    <span class="altag">
        <span class="altag_flag" style="--flag-bg: url('./img/flag-svg/${e.adv}.svg')"></span>
        <output class="altag_level">${e.lvl}</output>
    </span>
    <div class="effect-detail">
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
    const li = document.createElement('li');
    li.innerHTML = html;
    return li;
}

function makeFearElement(fear) {
    const html = `
<article data-ref="fear" class="adversary-effect">
    <span class="altag">
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
    const li = document.createElement('li');
    li.innerHTML = html;
    return li;
}


const iconReplacements = {
    city: '<img src="./img/icon/City.svg" class="icon" alt="City" />',
    town: '<img src="./img/icon/Town.svg" class="icon" alt="Town" />',
    explorer: '<img src="./img/icon/Explorer.svg" class="icon" alt="Explorer" />',
    fear: '<img src="./img/icon/Fear.svg" class="icon" alt="Fear" />',
    blight: '<img src="./img/icon/Blight.svg" class="icon" alt="Blight" />',
    dahan: '<img src="./img/icon/Dahan.svg" class="icon" alt="Dahan" />',
    beasts: '<img src="./img/icon/Beasts.svg" class="icon" alt="Beasts" />',
    disease: '<img src="./img/icon/Disease.svg" class="icon" alt="Disease" />',
    presence: '<img src="./img/icon/Presence.svg" class="icon" alt="Presence" />',
    fast: '<img src="./img/icon/Fast.svg" class="icon clr-fast" alt="Fast" />',
};


const rxIcon = /\[([A-Za-z]+)\]/g;
function iconMatch(match, g1) {
    const key = g1.toLowerCase();
    const repl = iconReplacements[key];
    return repl || match;
}

const rxRange = /\[Range:([^\]]+)\]/g;
function rangeMatch(match, g1) {
    //return `<span class="range"><b>${g1}</b><img src="./img/RangeArrow.svg" /></span>`;
    return `<span class="inline-range">${g1}</span>`;
}

const romanChars = ' ⅠⅡⅢ';
const rxStage = /Stage (I{1,3})/g;
function stageMatch(match, g1) {
    return `<span class="keep-together">Stage ${romanChars[g1.length]}</span>`;
}

const rxfIcon = String.raw`\[([A-Za-z]+)\]`;

const rxLandNum = /land #[1-8]/g;
const rxIconTogether = new RegExp(`((?:[0-9]+|a|no) )?${rxfIcon}(/${rxfIcon})?[.,]?`, 'ig');

function keepTogether(match) {
    return `<span class="keep-together">${match}</span>`;
}


function prettyHtml(text) {
    if (!text) { return ''; }
    return text
        .replace(rxIconTogether, keepTogether)
        .replace(rxLandNum, keepTogether)
        .replace(rxStage, stageMatch)
        .replace(rxRange, rangeMatch)
        .replace(rxIcon, iconMatch);
        
}

export function enhanceText(text) {
    return prettyHtml(text);
}


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
 * 
 * @param {SelPair} selection 
 */
export function combineAdversaries(selection) {
    
    //TODO: Handle weird input

    //Invader Deck Effects: follower, then leader

    //All Other Effects: Setup/Play Leader/Follower

    const timingTree = buildTimingTree();

    //const groupedEffects = {};
    function addEffect(order, effect) {
        /*
        const groupKey = 'k' + order;
        let group = groupedEffects[groupKey];
        if (!group) {
            groupedEffects[groupKey] = group = { order: order, effects: [] };
        }
        group.effects.push(effect);
        */
        timingTree.addEffect(effect);
    }

    

    const leader = officialData.filter(x => x.adv === selection.leader.adversary)[0] || { effects: [] };
    const follow = officialData.filter(x => x.adv === selection.follow.adversary)[0] || { effects: [] };
    const leaderInv = [];
    leader.effects.forEach(e => {
        if (e.lvl > selection.leader.level) { return; }
        if (e.inv) { leaderInv.push(e); return; }
        e.order.forEach(o => addEffect(o, e));
    });
    follow.effects.forEach(e => {
        if (e.lvl > selection.follow.level) { return; }
        e.order.forEach(o => addEffect(o, e));
    })
    leaderInv.forEach(e => {
        e.order.forEach(o => addEffect(o, e));
    });

    const leaderLevel = (leader.levels || []).filter(x => x.lvl === selection.leader.level)[0] || {};
    const followLevel = (follow.levels || []).filter(x => x.lvl === selection.follow.level)[0] || {};

    const $setup = document.querySelector('#setup-effects > ul');
    const $play = document.querySelector('#play-effects > ul');
    $setup.innerHTML = '';
    $play.innerHTML = '';

    //Invader Deck


    //Fear Deck
    const fear = addFear(leaderLevel.fear, followLevel.fear);
    $setup.appendChild(makeFearElement(fear));

/*
    //Other Effects
    for (const groupKey in groupedEffects) {
        const group = groupedEffects[groupKey];
        const $box = group.order < 2000 ? $setup : $play;

        group.effects.forEach(e => $box.appendChild(makeEffectElement(e)));
        
    }
*/

    showEffects(timingTree.children['1000'], $setup, follow);
    showEffects(timingTree.children['2000'], $play, follow);

}

function showEffects(period, $box, follow) {
    const effects = [];
    effects.push(...period.iterateEffects());
    if (effects.length > 0) {
        $box.appendChild(makeElement('h3', period.title, 'effect-header'));
        effects.forEach(e => $box.appendChild(makeEffectElement(e, follow)));
    }

    //period.effects['1'].forEach(e => $box.appendChild(makeEffectElement(e)));
    //period.effects['2'].forEach(e => $box.appendChild(makeEffectElement(e)));
    //period.effects['5'].forEach(e => $box.appendChild(makeEffectElement(e)));
    for (const key in period.children) {
        showEffects(period.children[key], $box, follow);
    }
    //period.effects['8'].forEach(e => $box.appendChild(makeEffectElement(e)));
    //period.effects['9'].forEach(e => $box.appendChild(makeEffectElement(e)));
}
