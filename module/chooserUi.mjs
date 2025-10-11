import officialData from "../data/adversaries.json" with { type: "json" };
import { SelPair } from "./models.mjs";
import { combineAdversaries } from "./effectUi.mjs";

const selections = new SelPair();

function refreshSelectionsDisplay() {
    refreshSelectionDisplay('leader');
    refreshSelectionDisplay('follow');
}

function refreshSelectionDisplay(mode) {
    const $chooser = document.querySelector(`.adversary-selection > [data-mode="${mode}"]`);
    const sel = selections[mode];

    const adv = sel.adversary || 'NONE';
    $chooser.dataset.adv = adv;
    
    const $btn = $chooser.querySelector('button');
    const $name = $chooser.querySelector('[data-ref="name"]');
    const $level = $chooser.querySelector('[data-ref="level"]');
    
    if (adv === 'NONE') {
        $name.textContent = 'No Adversary';
        $level.textContent = '';
        $btn.style.removeProperty('--flag-bg');
    } else {
        const a = officialData.find(a => a.adv === adv);
        $name.innerHTML = a.htmlname;
        $level.innerHTML = `Level <b>${sel.level}</b>`;
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

}

function refreshLevelSlider(mode) {
    const $slider = document.querySelector(`.adversary-selection [data-mode="${mode}"] input[type="range"]`);
    $slider.value = selections[mode].level;
}


export function initializeChooserUi() {
    const $dialog = document.querySelector('.adversary-selection dialog');
    fillAdversaryList($dialog);
    wireDialog($dialog);
    wireSwapButton();
    wireLevelSlider('leader');
    wireLevelSlider('follow');
    wireCombineButton();
}

const divLeaderTag = `
    <div data-mode="leader" title="Leader Adversary">⬢</div>
`;
const divFollowerTag = `
    <div data-mode="follow" title="Follower Adversary">▲</div>
`;

function fillAdversaryList($dialog) {
    const $ul = $dialog.querySelector('ul');

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
        const temp = selections.leader;
        selections.leader = selections.follow;
        selections.follow = temp;
        refreshSelectionsDisplay();
        refreshLevelSlider('leader');
        refreshLevelSlider('follow');
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
        $dialog.close();
    });

    const $choosers = document.querySelectorAll('.adversary-selection > [data-mode]');
    $choosers.forEach($c => {
        const $button = $c.querySelector('button');
        $button.addEventListener('click', () => {
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
    });
}

function wireCombineButton() {
    const $combine = document.getElementById('combine-button');
    $combine.addEventListener('click', e => {
        combineAdversaries(selections);
    });
}
