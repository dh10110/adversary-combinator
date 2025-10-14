import officialData from "../data/adversaries.json" with { type: "json" };
import { SelectedAdversaries } from "./models.mjs";
import { combineAdversaries } from "./effectUi.mjs";
import { getAllAdversaries } from "./dataAccess.mjs";

//const selections = new SelPair();
const selections = new SelectedAdversaries();

const MODE_LEADING = 'leading';
const MODE_SUPPORTING = 'supporting';

function refreshSelectionsDisplay() {
    refreshSelectionDisplay(MODE_LEADING);
    refreshSelectionDisplay(MODE_SUPPORTING);
}

function refreshSelectionDisplay(mode) {
    const $chooser = document.querySelector(`.adversary-selection > [data-mode="${mode}"]`);
    const sel = selections[mode];

    const adv = sel.adv || 'NONE';
    $chooser.dataset.adv = adv;
    
    const $btn = $chooser.querySelector('button');
    const $name = $chooser.querySelector('[data-ref="name"]');
    const $level = $chooser.querySelector('[data-ref="level"]');
    
    if (adv === 'NONE') {
        $name.textContent = 'No Adversary';
        $level.textContent = '';
        $btn.style.removeProperty('--flag-bg');
    } else {
        //const a = officialData.find(a => a.adv === adv);
        //const a = sel.
        $name.innerHTML = sel.adversary.htmlname;
        $level.innerHTML = `Level <b>${sel.lvl}</b>`;
        $btn.style.setProperty('--flag-bg', `url('./img/flag-svg/${a.adv}.svg')`);
    }

    //dialog items
    const $dialog = document.querySelector('.adversary-selection dialog');
    const $buttons = $dialog.querySelectorAll(`button[data-sel="${mode}"]`);
    $buttons.forEach($b => {
        delete $b.dataset.sel;
    });
    const $selButton = $dialog.querySelector(`button[data-adv="${adv}"]`);
    if ($selButton) {
        $selButton.dataset.sel = mode;
    }

    //details summary (closed)
    const $details = document.getElementById('chooser-page');
    const $summaryClosed = $details.querySelector('summary .when-closed');
    $summaryClosed.innerHTML = selections.getSummaryTitle();

    //Combine Button
    const $combine = document.getElementById('combine-button');
    $combine.dataset[mode] = adv === 'NONE' ? null : 'y';
}


function refreshLevelSlider(mode) {
    const $slider = document.querySelector(`.adversary-selection [data-mode="${mode}"] input[type="range"]`);
    $slider.value = selections[mode].level;
}

function refreshDifficulty() {
    const $diff = document.getElementById('combined-difficulty');
    $diff.innerText = computeDifficulty();
}

function computeDifficulty() {
    const hasLeader = selections.leader.adversary !== null;
    const hasSupport = selections.follow.adversary !== null;

    let diffLead = 0;
    let diffSupport = 0;

    if (hasLeader) {
        diffLead = lookupDiff(selections.leader);
    }

    if (hasSupport) {
        diffSupport = lookupDiff(selections.follow);
    }

    if (diffSupport === 0) { return diffLead; }
    if (diffLead === 0) { return diffSupport; }

    //Combined = Bigger + 50%-75% of lesser
    const [min, max] = minmax(diffLead, diffSupport);

    const lb = Math.round(min * 0.5);
    const ub = Math.round(min * 0.75);

    if (lb === ub) { return max + lb; }
    return `${max+lb}-${max+ub}`;
}

function minmax(value1, value2) {
    if (value1 > value2) { return [value2, value1]; }
    return [value1, value2];
}

function lookupDiff(adv, lvl) {
    if (adv instanceof SelAdv) { return lookupDiff(adv.adversary, adv.level); }

    const adversary = officialData.find(x => x.adv === adv);
    if (!adversary) { return 0; }
    if (!lvl) { return adversary.diff; }

    const level = adversary.levels.find(x => x.lvl === lvl);
    return level.diff || adversary.diff;
}


export function initializeChooserUi() {
    const $dialog = document.querySelector('.adversary-selection dialog');
    fillAdversaryList($dialog);
    wireDialog($dialog);
    wireSwapButton();
    wireLevelSlider(MODE_LEADING);
    wireLevelSlider(MODE_SUPPORTING);
    wireCombineButton();
}

const divLeaderTag = `
    <div data-mode="leader" title="Leader Adversary">⬢</div>
`;
const divFollowerTag = `
    <div data-mode="follow" title="Follower Adversary">▲</div>
`;

const divLeadingTag = `
    <div data-mode="${MODE_LEADING}" title="Leading Adversary">⬢</div>
`;
const divSupportingTag = `
    <div data-mode="${MODE_SUPPORTING}" title="Supporting Adversary">▲</div>
`;

function fillAdversaryList($dialog) {
    const $ul = $dialog.querySelector('ul');

    const adversaries = getAllAdversaries(true);
    for (const a of adversaries) {
        const advId = a.adv || a.nickname;
        const $li = document.createElement('li');
        li.innerHTML = `
            <button type="submit" class="advflag flag-button" data-adv="${advId}" title="${a.fullname}"
                    style="">
                <div class="flag-text">
                    <div>${a.htmlname}</div>
                </div>
                ${divLeadingTag}
                ${divSupportingTag}
            </button>
        `;
        $ul.appendChild(li);
    }

    return;
    //TODO: Delete below

    //No Adversary
    const li = document.createElement('li');
    li.innerHTML = `<button type="submit" class="flag-button" data-adv="NONE" title="No Adversary"><div class="flag-text">No Adversary</div></button>`;
    $ul.appendChild(li);

    //Add Official Adversaries
    officialData.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `
            <button type="submit" class="flag-button" data-adv="${a.adv}" title="${a.fullname}"
                    style="--flag-bg: url('./img/flag-svg/${a.adv}.svg')">
                <div class="flag-text">
                    <div>${a.htmlname}</div>
                </div>
                ${divLeaderTag}
                ${divFollowerTag}
            </button>
        `;
        $ul.appendChild(li);
    });
}

function wireSwapButton() {
    const $swap = document.getElementById('swap-adversaries');
    $swap.addEventListener('click', e => {
        /*
        const temp = selections.leader;
        selections.leader = selections.follow;
        selections.follow = temp;
        */
        [selections.leading, selections.supporting]
            = [selections.supporting, selections.leading];
        refreshSelectionsDisplay();
        refreshLevelSlider(MODE_LEADING);
        refreshLevelSlider(MODE_SUPPORTING);
    });
}

function wireDialog($dialog) {
    const $form = $dialog.querySelector('form');
    $form.addEventListener('submit', e => {
        e.preventDefault();
        const $sel = e.submitter;
        const adv = $sel.dataset.adv;
        const mode = $dialog.dataset.mode;
        selections[mode].adversary = adv;
        refreshSelectionDisplay(mode);
        refreshDifficulty();
        $dialog.close();
    });

    const $choosers = document.querySelectorAll('.adversary-selection > [data-mode]');
    $choosers.forEach($c => {
        const $button = $c.querySelector('button');
        $button.addEventListener('click', e => {
            $dialog.dataset.mode = $c.dataset.mode;
            $dialog.showModal();
        });
    });
}

function wireLevelSlider(mode) {
    const $slider = document.querySelector(`.adversary-selection [data-mode="${mode}"] input[type="range"]`);
    $slider.addEventListener('input', e => {
        const val = parseInt($slider.value);
        selections[mode].level = val;
        refreshSelectionDisplay(mode);
        refreshDifficulty();
    });
}

function wireCombineButton() {
    const $combine = document.getElementById('combine-button');
    $combine.addEventListener('click', e => {
        combineAdversaries(selections);
    });
}
