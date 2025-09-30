import officialData from "../data/official.json" with { type: "json" };
import { makeEffectElement } from "./effectUi.mjs";
import { initializeChooserUi } from "./chooserUi.mjs";

document.addEventListener('DOMContentLoaded', function () {
    //console.log('DOM fully loaded and parsed');

    
    officialData.forEach(a => {
        console.log(a.adv,
            "Levels:", a.levels.length,
            "Effects:", a.effects.length);
    
    });


    const $out = document.getElementById('debug');
    officialData.forEach(a => {
        a.effects.forEach(e => {
            const div = makeEffectElement(e);
            $out.appendChild(div);
        });
    });

    initializeChooserUi();
});

//console.log('Module combinator end');
