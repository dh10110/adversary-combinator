import officialData from "../data/adversaries.json" with { type: "json" };
import { makeEffectElement } from "./effectUi.mjs";
import { initializeChooserUi } from "./chooserUi.mjs";

document.addEventListener('DOMContentLoaded', function () {

    const $out = document.getElementById('debug');
    officialData.forEach(a => {
        a.effects.forEach(e => {
            const div = makeEffectElement(e);
            $out.appendChild(div);
        });
    });

    initializeChooserUi();
});
