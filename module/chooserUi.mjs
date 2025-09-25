import officialData from "../official.json" with { type: "json" };

class SelAdv {
    constructor() {
        this.adversary = null;
        this.level = 1;
    }
}

const selections = {
    leader: new SelAdv(),
    follow: new SelAdv(),
};

function refreshSelectionsDisplay() {
    refreshSelectionDisplay('leader');
    refreshSelectionDisplay('follow');
}

function refreshSelectionDisplay(mode) {
    const $chooser = document.querySelector(`.adversary-selection > [data-mode="${mode}"]`);
    const sel = selections[mode];

    const adv = sel.adversary || 'NONE';
    $chooser.dataset.adv = adv;
    
    const $name = $chooser.querySelector('[data-ref="name"]');
    const $level = $chooser.querySelector('[data-ref="level"]');
    
    if (adv === 'NONE') {
        $name.textContent = 'NONE';
        $level.textContent = '';
    } else {
        const a = officialData.find(a => a.adv === adv);
        $name.textContent = a.fullname;
        $level.textContent = `Level ${sel.level}`;
    }


}


export function initializeChooserUi() {
    const $dialog = document.querySelector('.adversary-selection dialog');
    fillAdversaryList($dialog);
    initializeDialogHandlers($dialog);
}

function fillAdversaryList($dialog) {
    const $ul = $dialog.querySelector('ul');

    //No Adversary
    const li = document.createElement('li');
    li.innerHTML = `<button type="submit" data-adv="NONE" title="No Adversary">No Adversary</button>`;
    $ul.appendChild(li);

    officialData.forEach(a => {
        const li = document.createElement('li');
        li.innerHTML = `<button type="submit" data-adv="${a.adv}" title="${a.fullname}">${a.nickname}</button>`;
        $ul.appendChild(li);
    });
}

function initializeDialogHandlers($dialog) {
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
