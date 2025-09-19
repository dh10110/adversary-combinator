

ADV = (function () {
	
	const exports = {};
	
	const model = {
		mode: null,
		lead: null,
		follow: null,
		leadLvl: 1,
		followLvl: 1
	};
	
	const advIndex = {
		NONE: { Code: "NONE", ShortName: 'None' }
	};
	
	function selectAdv(code) {
		console.log('Selected:', code, model.mode);
		
		const key = model.mode;
		setAdv(key, code);
	}
	function setAdv(key, code) {
		const cls = `sel-adv-${key}`;
		
		if (model[key]) {
			const priorElem = document.querySelector(`.adv-choice[data-id=${model[key].Code || "NONE"}]`);
			priorElem.classList.remove(cls);
		}
		
		const adv = model[key] = advIndex[code];
		const elem = document.querySelector(`.adv-choice[data-id=${code}]`);		
		elem.classList.add(cls);
		
		
		const $name = document.getElementById(`${key}-name`);
		$name.innerText = adv.ShortName;
		
		const $flag = document.getElementById(`${key}-flag`);
		$flag.src = `./img/flag-svg/${adv.Code}.svg`;

	}
	
	function setLevel(mode, level) {
		model[`${mode}Lvl`] = level;
		const $level = document.getElementById(`${mode}-level`);
		$level.innerText = level;

		const $slider = document.getElementById(`adv-sel-${mode}-lvl`);
		if ($slider.value != level) {
			$slider.value = level;
		}

	}

	function getLeadDifficulty() {
		if (!model.lead || !model.lead.levels) { return null; }
		if (model.leadLvl < 1) { return model.lead.BaseDifficulty; }
		const [level] = model.lead.levels.filter(l => l.level == model.leadLvl) || [null];
		return level.Difficulty;
	}

	function getFollowDifficulty() {
		if (!model.follow || !model.follow.levels) { return null; }
		if (model.followLvl < 1) { return model.follow.BaseDifficulty; }
		const [level] = model.follow.levels.filter(l => l.level == model.followLvl) || [null];
		return level.Difficulty;
	}

	function computeDifficulty(){
		const leadDifficulty = getLeadDifficulty();
		const followDifficulty = getFollowDifficulty();

		if (leadDifficulty === null && followDifficulty === null) { return 0; }

		if (leadDifficulty === null) { return followDifficulty; }
		if (followDifficulty === null) { return leadDifficulty; }

		const sorted = [leadDifficulty, followDifficulty].sort((a,b) => b - a);

		const min = Math.round(sorted[1] * 0.5);
		const max = Math.round(sorted[1] * 0.75);

		//const min = (sorted[1] * 0.5);
		//const max = (sorted[1] * 0.75);

		if (min === max) { return sorted[0] + min; }
		return `${sorted[0] + min} - ${sorted[0] + max}`;
	}
	function updateDifficulty() {
		const difficulty = computeDifficulty();

		const $diff = document.getElementById('difficulty');
		$diff.innerText = difficulty;	
	}
	
	
	const iconReplacements = {
		city: '<img src="./img/City.svg" class="icon" />',
		town: '<img src="./img/Town.svg" class="icon" />',
		explorer: '<img src="./img/Explorer.svg" class="icon" />',	
		fear: '<img src="./img/Fear.svg" class="icon" />',	
		blight: '<img src="./img/Blight.svg" class="icon" />',	
		dahan: '<img src="./img/Dahan.svg" class="icon" />',	
		beasts: '<img src="./img/Beasts.svg" class="icon" />',
		disease: '<img src="./img/Disease.svg" class="icon" />',
		presence: '<img src="./img/Presence.svg" class="icon" />',
	};
	
	const iconRegex = /\[([A-Za-z]+)\]/g;
	function iconMatch(match, g1) {
		const key = g1.toLowerCase();
		const repl = iconReplacements[key];
		return repl || match;
	}
	
	const rangeRegex = /\[Range:([^\]]+)\]/g;
	function rangeMatch(match, g1) {
		//return `<span class="range"><b>${g1}</b><img src="./img/RangeArrow.svg" /></span>`;
		return `<span class="inline-range">${g1}</span>`;
	}
	
	const romanChars = ' ⅠⅡⅢ';
	const stageRegex = /Stage (I{1,3})/g;
	function stageMatch(match, g1) {
		return `Stage ${romanChars[g1.length]}`;
	}
	
	function prettyHtml(text) {
		if (!text) { return ''; }
		return text
			.replace(rangeRegex, rangeMatch)
			.replace(iconRegex, iconMatch)
			.replace(stageRegex, stageMatch);
	}
	
	
	
	const allEffects = {
		//invader board
		invaderDeck: [],
		fearPool: [],
		fearDeck: [],
		blightCard: [],
		
		//island and supply
		islandSetup: [], //includes Beasts & Disease
		supplySetup: [],
		
		//player
		player: [],
		
		//finalize
		initialExplore: [],
		setupFinal: [],
		
		//Other
		setup: [],
		
		//During Play
		loss: [],
		always: [],
		//Invader Phase
		blight: [],
		event: [],
		fear: [],
		ravage: [],
		afterRavage: [],
		build: [],
		afterBuild: [],
		beforeExplore: [], //aka onEscalationReveal
		explore: [],
		afterExplore: [],
		advance: []
	};
	
	
	function isSetupEffect(key) {
		switch (key) {
			case 'islandSetup':
			case 'invaderDeck':
			case 'fearPool':
			case 'supplySetup':
			case 'fearDeck':
			case 'setupFinal':
			case 'setup':
				return true;
		}
		return false;
	}
	
	
	function getEffectType(dataText) {
		switch (dataText) {
			case 'island-setup': return 'islandSetup';
			case 'invader-deck': return 'invaderDeck';
			case 'fear-pool-setup': return 'fearPool';
			case 'initial-explore': return 'initialExplore';
			case 'event-setup': return 'supplySetup';
			case 'fear-deck': return 'fearDeck';
			case 'setup-final': return 'setupFinal';

			case 'setup':
			case 'general-setup':
				return 'setup';
			
			case 'blight-step': return 'blight';
			case 'event-step': return 'event';
			case 'fear-step': return 'fear';
			case 'ravage-step': return 'ravage';
			case 'after-ravage-step': return 'afterRavage';
			case 'build-step': return 'build';
			case 'after-build-step': return 'afterBuild';			
			case 'before-explore-step': return 'beforeExplore';			
			case 'explore-step': return 'explore';
			case 'after-explore-step': return 'afterExplore';			
			case 'advance-cards-step': return 'advance';
		}
		return dataText;
	}
	
	function getEscalationEffectType(dataText) {
		switch (dataText) {
			case 'before': return 'beforeExplore';
			case 'after-action': return 'explore';
			case 'after-step': return 'afterExplore';
			case 'advance': return 'advance';
		}
		return dataText;
	}
	
	function flagFor(code) {
		return `<img src="./img/small-flag/${code}.png" />`;
	}
	
	
	
	function makeAdvChooser() {
		const snippets = [];
		
		adv.forEach(a => {
			snippets.push(`
<li><button class="adv-choice" data-id="${a.Code}">
	<img src="./img/small-flag/${a.Code}.png" />
	<div class="adv-name">${a.ShortName}</div>
</button></li>
			`);
		});
		
		const containerHtml = `
	<ul class="popup-content adv-chooser">
		${snippets.join('')}
		<li><button class="adv-choice" data-id="NONE">
			<div class="adv-name">None</div>
		</button></li>
	</ul>
		`;
		
		//const container = document.getElementById('chooser-adv1');
		const container = document.createElement('div');
		container.classList.add('popup-container');
		container.innerHTML = containerHtml;
		document.body.appendChild(container);
				
		container.addEventListener('click', function (e) {
			console.log(e.target);
			
			const choiceItem = e.target.closest('.adv-choice');
			if (choiceItem) {

				code = choiceItem.dataset['id'];
				selectAdv(code);
				container.style.display = 'none';
				e.stopPropagation();
				updateDifficulty();
			}
		}, true);
		
		
		const openers = document.querySelectorAll('.adv-sel');
		openers.forEach(function (elem) {
			elem.addEventListener('click', function (e) {
				model.mode = e.currentTarget.dataset['mode'];
				container.style.display = 'block';
			}, true);
		});

	}
	
	function wireLevelSetters() {
		const sliders = document.querySelectorAll('input[type=range][data-mode]');
		sliders.forEach(function (elem) {
			elem.addEventListener('change', function (e) {
				const mode = e.currentTarget.dataset['mode'];
				setLevel(mode, e.currentTarget.value);
				updateDifficulty();
			});
		});
		
	}
	
	
	function listSelectedEffects() {
		
		
		selectedEffects = {};
		function addEffect(key, effect) {
			const list = selectedEffects[key] || (selectedEffects[key] = []);
			list.push(effect);
		}
		
		const selected = [];
		if (model.follow && model.follow.levels) { selected.push({
			adv: model.follow,
			lvl: model.followLvl,
			key: 'follow',
		}); }
		if (model.lead && model.lead.levels) { selected.push({
			adv: model.lead,
			lvl: model.leadLvl,
			key: 'lead',
		}); }
		
		const level = {};
		
		//todo: distinguish escalation lead/follow
		selected.forEach(s => {
			const a = s.adv;
			
			if (a.LossConditionText !== null) {
				addEffect('loss', {
					EffectName: a.LossCondition,
					EffectText: a.LossConditionText,
					effectKey: 'loss',
					loss: true,
					adv: a.key,
					lvl: 0,
					adversary: a,
				});
			}
			
			const escKey = getEscalationEffectType(a.EscalationOrder);
			addEffect(escKey, {
				EffectName: a.EscalationName,
				EffectText: a.EscalationText,
				effectKey: escKey,
				escalation: s.key === 'follow' ? 3 : 2,
				adv: a.key,
				lvl: 0,
				adversary: a
			});
			
			a.levels && a.levels.forEach(l => {
				if (l.level == s.lvl) {
					level[s.key] = l;
				}
				if (l.level > s.lvl) return false;
				l.effects.forEach(eff => {
					keys = eff.EffectType.split('+');
					keys.forEach(k => {
						const effectKey = getEffectType(k);
						addEffect(effectKey, eff);
					});
				});
			});
		});
		
		
		const invaderDeck = buildInvaderDeck(selected);
		
		
		const $setup = document.getElementById('setup-effects');
		const $play = document.getElementById('play-effects');

		$setup.innerHTML = '';
		$play.innerHTML = '';
		
		
		$setup.appendChild(makeInvDeckUI(invaderDeck));
		
		
		const fear = { Fear1: 3, Fear2: 3, Fear3: 3 };
		if (level.lead) {
			fear.Fear1 += level.lead.Fear1;
			fear.Fear2 += level.lead.Fear2;
			fear.Fear3 += level.lead.Fear3;
		}
		
		$setup.appendChild(makeFearUI(fear));
		
		
		for (const k in selectedEffects) {
			const arr = selectedEffects[k];
			const $to = isSetupEffect(k) ? $setup : $play;
			
			arr.forEach(e => {
				$to.appendChild(makeEffectUI(e, k));
			});
		}
		
	}
	
	const invSpecials = {
		C: {n: 'C', s: 2, w: 'C is the Coastal Lands card'},
		S: {n: 'S', s: 2, w: 'S is the Salt Deposits card'},
		H: {n: 'H', w: 'H is the Habsburg Reminder card'},
	};
	function buildInvaderDeck(selected) {
		const invDeckCmds = [];
		selected.forEach(s => {
			s.adv.levels && s.adv.levels.forEach(l => {
				if (l.level > s.lvl) return false;
				l.effects.forEach(e => {
					if (e.InvDeck) {
						invDeckCmds.push(...e.InvDeck);
					}
				});
			});
		});
		
		const deck = [{s:1},{s:1},{s:1},{s:2},{s:2},{s:2},{s:2},{s:3},{s:3},{s:3},{s:3},{s:3}];
		
		function findIndexOf(stage, ordinal) {
			if (ordinal === 'b') {
				//bottom
				for (let i = deck.length - 1; i >= 0; i--) {
					if (deck[i].s === stage) return i;
				}
			}
			
			let counter = 0;
			for (let i = 0; i < deck.length; i++) {
				if (stage === '@' || deck[i].s === stage) {
					counter++;
					if (counter === ordinal) { return i; }
				}
				
			}
			
			return null;
		}
		function findIndex(text, iRef) {
			if (text === '?') {return iRef;}
			
			let [st, num, ord] = text;
			if (+st) { st = +st; }
			if (+ord) { ord = +ord; }
			
			return findIndexOf(st, ord);
		}
		
		function handleMove(cmd, iRef) {
			const iMove = findIndex(cmd.m, iRef);
			if (iMove === null) return;
			
			if (cmd.u) {
				//up
				const iInsert = iMove - 1;
				if (iInsert < 0) return;
				//remove from original Location
				const [card] = deck.splice(iMove, 1);
				//insert 
				deck.splice(iInsert, 0, card);
				return;
			}
			
			const iBelow = findIndex(cmd.b, iRef);
			if (iBelow === null) return;
			const iInsert = iBelow + 1;
			//remove from original Location
			const [card] = deck.splice(iMove, 1);
			//insert 
			deck.splice(iInsert, 0, card);
		}
		
		function handleReplace(cmd, iRef) {
			const iTarget = findIndex(cmd.t, iRef);
			if (iTarget === null) return;
			
			//named special from out of deck
			if (cmd.n) {
				deck[iTarget] = invSpecials[cmd.n];
				return;
			}
			//if no named special, and no card from the deck, delete
			if (!cmd.n && !cmd.f) {
				//deck.removeAt(iTarget);
				deck.splice(iTarget, 1);
				return;
			}
			iFrom = findIndex(cmd.f, iRef);
			if (iTarget === null) return;
			
			deck[iTarget] = deck[iFrom];
			deck.splice(iFrom, 1);
		}
		
		function handleAdd(cmd) {
			const iBelow = findIndex(cmd.b);
			if (iBelow === null) return;
			
			const iInsert = iBelow + 1;
			deck.splice(iInsert, 0, invSpecials[cmd.n]);
		}
		
		function handleEach(cmd) {
			for (let iRef = 0; iRef < deck.length; iRef++) {
				if (cmd.e === deck[iRef].s) {
					handleCommand(cmd.x, iRef);
				}
			}
		}
		
		function handleCommand(cmd, iRef) {
			if (cmd.e) {
				handleEach(cmd);
				return;
			}
			
			switch(cmd.a) {
				case 'm': handleMove(cmd, iRef); return;
				case 'r': handleReplace(cmd, iRef); return;
				case 'a': handleAdd(cmd, iRef); return;
			}
			
			debugger;
			
			return;
		}
		
		invDeckCmds.forEach(c => handleCommand(c));
		
		return deck;
	}
	
	function displayInvDeck(deck) {
		
		const sb = [];
		let prev = 0;
		const wheres = [];
		
		deck.forEach(c => {
			if (prev !== 0 && prev !== c.s) { sb.push('·'); }
			sb.push(c.n || c.s);
			if (c.w) { wheres.push(c.w); }
			prev = c.s;
		});
		const txtWhere = `${wheres.length > 0 ? ' where ' : ''}${wheres.join(', ')}`;
		return `<span class="invader-deck">Deck Order: ${sb.join('')}${txtWhere}</span>`;
		
	}
	
	
	function makeInvDeckUI(deck) {
		const clone = tplLvlItem.content.cloneNode(true);
		const type = clone.querySelector('.itemType');
		type.textContent = 'Invader Deck';
		const text = clone.querySelector('.itemText');
		text.innerHTML = displayInvDeck(deck);
		return clone;
	}
	
	
	function makeFearUI(fear) {
		const clone = tplLvlItem.content.cloneNode(true);
		const type = clone.querySelector('.itemType');
		type.textContent = 'Fear Deck';
		const text = clone.querySelector('.itemText');
		text.innerHTML = `
			<span class="fear-deck">
				${fear.Fear1}
				<img class="tl" src="./img/tl2.svg" />
				${fear.Fear2}
				<img class="tl" src="./img/tl3.svg" />
				${fear.Fear3}
			</span>
		`;		
		return clone;
	}
	
	
	const tplLvlItem = document.getElementById('levelItem');
	function makeEffectUI(effect, effectKey) {
		const clone = tplLvlItem.content.cloneNode(true);
		const type = clone.querySelector('.itemType');
		type.textContent = effectKey || effect.effectKey || effect.EffectType;
		const text = clone.querySelector('.itemText');
		text.innerHTML = `<b class="effect-flag">${flagFor(effect.adversary.Code)}${effect.lvl}</b><div class="effect-text"><b class="title">${escHtml(effect.escalation)}${effect.EffectName}</b> ${prettyHtml(effect.EffectText)} <i>${prettyHtml(effect.ExtraText)}</i></div>` ;
		return clone;
	}
	
	function escHtml(esc) {
		switch (esc) {
			case 2: return 'Escalation <img src="./img/Escalation.svg" class="icon" />: ';
			case 3: return 'Escalation Ⅲ: ';
		}
		return '';
	}

	
	function listAllEffects() {
		
		//const tplLvlItem = document.getElementById('levelItem');
		const itemList = document.getElementById('debug');
	
		adv.forEach(a => {
			advIndex[a.Code] = a;

			if (a.LossConditionText !== null) {
				allEffects.loss.push({
					EffectName: a.LossCondition,
					EffectText: a.LossConditionText,
					effectKey: 'loss',
					loss: true,
					adv: a.key,
					lvl: 0,
					adversary: a,
				});
			}
			
			const escKey = getEscalationEffectType(a.EscalationOrder);
			const arr = allEffects[escKey];
			if (arr) {
				arr.push({
					EffectName: a.EscalationName,
					EffectText: a.EscalationText,
					effectKey: escKey,
					escalation: true,
					adv: a.key,
					lvl: 0,
					adversary: a
				});
			} else {
				console.log('Unhandled Esc', escKey);
			}


			a.levels.forEach(function (level) {
				
				level.effects.forEach(function (effect) {
					
					effect.level = level;
					effect.adversary = a;
					
					types = effect.EffectType.split('+');
					
					types.forEach(function (t) {
						const effectKey = getEffectType(t);
						effect.effectKey = effectKey;
						const arr = allEffects[effectKey];
						if (arr) { arr.push(effect); } else { console.log('Unhandled', effectKey); }
					});
					
				});
				
			});
			
		});//adv
		
		
		function addEffect(effect, effectKey) {
			const clone = tplLvlItem.content.cloneNode(true);
			const type = clone.querySelector('.itemType');
			type.textContent = effectKey || effect.effectKey || effect.EffectType;
			const text = clone.querySelector('.itemText');
			text.innerHTML = `<b class="effect-flag">${flagFor(effect.adversary.Code)}${effect.lvl}</b><div class="effect-text"><b class="title">${(effect.escalation ? '<img src="./img/Escalation.svg" class="icon" /> ' : '')}${effect.EffectName}</b> ${prettyHtml(effect.EffectText)} <i>${prettyHtml(effect.ExtraText)}</i></div>` ;
			itemList.appendChild(clone);
		}
		
		for (var key in allEffects) {
			allEffects[key].forEach(function (effect) {
				addEffect(effect, key);
			});
		}
		

		
	}

	function wireSwapButton() {
		const btn = document.getElementById('adv-sel-swap');

		btn.addEventListener('click', e=> {

			if (!model.follow || model.follow.Code === 'NONE') { return; }

			const cache = {
				lead: model.lead,
				leadLvl: model.leadLvl,
				follow: model.follow,
				followLvl: model.followLvl
			};
			
			setAdv('lead', cache.follow.Code);
			setLevel('lead', cache.followLvl);
			setAdv('follow', cache.lead.Code);
			setLevel('follow', cache.leadLvl);

		}, true);

	}

	function wireCombineButton() {
		const btn = document.getElementById('execute-combine');
		btn.addEventListener('click', e => {
			listSelectedEffects();
		}, true);
	}
	

	function makeUI() {
		makeAdvChooser();
		wireLevelSetters();
		wireSwapButton();
		wireCombineButton();
		listAllEffects();
		
		setAdv('lead', 'bp');
		setLevel('lead', 1);
		setAdv('follow', 'NONE');
		setLevel('follow', 1);
		updateDifficulty();
	}
	
	
	makeUI();
	
	exports.listSelectedEffects = listSelectedEffects;
	return exports;
})();

