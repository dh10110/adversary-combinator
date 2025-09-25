import officialData from "../official.json" with { type: "json" };

export function makeEffectElement(e) {
    const html = `<b>${e.name}</b> ${enhanceText(e.text)} <i>${e.xtext || ''}</i>`;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
}


const iconReplacements = {
    city: '<img src="./img/icon/City.svg" class="icon" title="City" />',
    town: '<img src="./img/icon/Town.svg" class="icon" title="Town" />',
    explorer: '<img src="./img/icon/Explorer.svg" class="icon" title="Explorer" />',
    fear: '<img src="./img/icon/Fear.svg" class="icon" title="Fear" />',
    blight: '<img src="./img/icon/Blight.svg" class="icon" title="Blight" />',
    dahan: '<img src="./img/icon/Dahan.svg" class="icon" />',
    beasts: '<img src="./img/icon/Beasts.svg" class="icon" />',
    disease: '<img src="./img/icon/Disease.svg" class="icon" />',
    presence: '<img src="./img/icon/Presence.svg" class="icon" />',
    fast: '<img src="./img/icon/Fast.svg" class="icon clr-fast" />',
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
const rxIconTogether = new RegExp(`([0-9+] )?${rxfIcon}(/${rxfIcon})?[.,]?`, 'ig');

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
