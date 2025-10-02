//#region Timing TypeDefs

/**
 * Data item from timing.json
 * @typedef {Object} TimingPeriodDataModel
 * @property {int} order - timing order id
 * @property {string} title - title of timing period
 */

//#endregion

//#region Adversary TypeDefs

/**
 * Adversary from json
 * @typedef {Object} AdversaryDataModel
 * @property {string} adv - Adversary ID Code
 * @property {string} nickname - Adversary nickname
 * @property {string} fullname - Adversary full name
 * @property {number} diff - Adversary base difficulty
 * @property {string} set - Set code where adversary released
 * @property {AdversaryLeveDataModel[]} levels - Details about each level of the adversary
 * @property {AdversaryEffectDataModel[]} effects - All effects applied by the adversary
 */

/**
 * Adversary Level from json
 * @typedef {Object} AdversaryLeveDataModel
 * @property {string} adv - Adversary ID Code
 * @property {number} lvl - Adversary level
 * @property {number} diff - Adversary difficulty at level
 * @property {FearArray} fear - Fear cards per terror level
 */

/**
 * Fear array: 3 elements, each indicating the number of fear cards per Terror Level, in the order TL1, TL2, TL3
 * @typedef {[number, number, number]} FearArray
 */


/**
 * Adversary Effect from json
 * @typedef {Object} AdversaryEffectDataModel
 * @property {string} ref - Unique id for this effect, of the form {adv}{lvl|TYPE}{alpha?}
 * @property {string} adv - Adversary ID Code
 * @property {number} lvl - Adversary level that effect is granted (0 for always)
 * @property {'level' | 'loss' | 'esc' | 'mult'} type - Types: Level, Loss Condition, Escalation, Multiple Adversaries
 * @property {string} name - Name of the effect
 * @property {string[]} timing - Names of timing periods this effect applies
 * @property {number[]} order - Array of order ids where this effect applies
 * @property {string} text - Text of the effect
 * @property {string} xtext - Extra (italic) text for the effect
 * @property {InvCmd} inv - Invader Deck modification command
 * @property {string} repl - Key for indicating a higher level effects replaces a lower level effect.
*/

/** 
 * Invader Command from json
 * @typedef {Object} InvCmd
 * @property {InvaderStage} e - invader stage to iterate
 * @property {InvCmd} $ - command to run for each iterated card; this command can use '?' to refer to the index of the current card.
 * @property {InvCmdQuery | undefined} m - card to move
 * @property {InvCmdQuery | undefined} r - card to remove / replace with m
 * @property {InvCmdQuery | undefined} b - card to place m below
 * @property {number} d - delta: number of cards to move m; negative is up, positive is down
 * @property {string} x - special card to exclude when making the deck
 */

/**
 * Invader Card Stage
 * @typedef {1|2|3|0} InvaderStage - Stage 1, 2, or 3; or 0 for any stage.
 */

/**
 * Invader Command Query to find card(s) in deck.
 * 
 * Expected String values: '?' for the index passed from forEach; or a member of {@link specials}.
 * @typedef {[InvaderStage, number] | string} InvCmdQuery
 */

//#endregion
