
/**
 * Enhance some game text with Icon and HTML formatting where appropriate.
 * @param {string} text - Game text to enhance.
 * @returns {string} text, enhanced with icons and HTML formatting.
 */
export function enhanceGameText(text) {
    return text
        .replace(rxIconTogether, keepTogether)
        .replace(rxLandNum, keepTogether)
        .replace(rxStage, stageReplacement)
        .replace(rxRange, rangeReplacement)
        .replace(rxIcon, iconReplacement);
}

/**
 * Get the HTML for an icon text replacement.
 * @param {string} iconName - name of the icon
 * @returns {string?} html text of icon replacement, or null if not available
 */
function iconHtml(iconName) {
    switch (iconName) {
        case 'City':
        case 'Town':
        case 'Explorer':
        case 'Fear':
        case 'Blight':
        case 'Dahan':
        case 'Beasts':
        case 'Disease':
        case 'Badlands':
        case 'Wilds':
        case 'Strife':
        case 'Presence':
        case 'SacredSite':
        case 'Fast':
        case 'Slow':
            return `<img src="./img/icon/${iconName}" class="icon" alt="${iconName}">`;
        default:
            return null;
    }
}

const rxIcon = /\[([a-z]+)\]/ig;
function iconReplacement(match, g1) {
    const repl = iconHtml(g1);
    return repl || match;
}

const rxRange = /\[Range:([^\]]+)\]/g;
function rangeReplacement(_, g1) {
    //return `<span class="range"><b>${g1}</b><img src="./img/RangeArrow.svg" /></span>`;
    return `<span class="inline-range">${g1}</span>`;
}

const romanChars = ' ⅠⅡⅢ';
const rxStage = /Stage (I{1,3})/g;
function stageReplacement(_, g1) {
    return `<span class="keep-together">Stage ${romanChars[g1.length]}</span>`;
}

const rxLandNum = /land #[1-8]/g;
const rxIconTogether = new RegExp(`((?:[0-9]+|a|no) )?${rxIcon.source}(/${rxIcon.source})?[.,]?`, 'ig');
function keepTogether(match) {
    return `<span class="keep-together">${match}</span>`;
}
