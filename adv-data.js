const adv = [
  {
    "Code": "bp",
    "ShortName": "Prussia",
    "LongName": "The Kingdom of Brandenburg-Prussia",
    "BaseDifficulty": 1,
    "Set": "base",
    "LossCondition": "None",
    "LossConditionText": null,
    "EscalationName": "Land Rush",
    "EscalationOrder": "before",
    "EscalationText": "On each board with [Town]/[City], add 1 [Town] to a land without [Town].",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "bp",
        "level": 1,
        "Difficulty": 2,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Fast Start",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board add 1 [Town] to land #3.",
            "Summary": "[Town] #3",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "bp",
        "level": 2,
        "Difficulty": 4,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Surge of Colonists",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, Move the bottom-most Stage III Card just below the bottom-most Stage I Card.",
            "InvDeck": [{ a: 'm', m: '3#b', b:'1#b' }],
            "invSetup": [{m:[3,-1], b:[1,-1]}],
            "Summary": null,
            "ExtraText": "(New Deck Order: 111-3-2222-3333)",
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "bp",
        "level": 3,
        "Difficulty": 6,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Efficient",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, remove 1 additional Stage I Card.",
            "InvDeck": [{ a: 'r', t: '1#1' }],
            "invSetup": [{ r: [1,1] }],
            "Summary": "Remove a Stage I",
            "ExtraText": "(New Deck Order: 11-3-2222-3333)",
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "bp",
        "level": 4,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Aggressive Timetable",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, remove 1 additional Stage II Card.",
			"InvDeck": [{ a: 'r', t: '2#1' }],
            "invSetup": [{ r: [2,1] }],
            "Summary": "Remove a Stage II",
            "ExtraText": "(New Deck Order: 11-3-222-3333)",
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "bp",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Ruthelessly Efficient",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, remove 1 additional Stage I Card.",
			"InvDeck": [{ a: 'r', t: '1#1' }],
            "invSetup": [{ r: [1,1] }],
            "Summary": "Remove a Stage I",
            "ExtraText": "(New Deck Order: 1-3-222-3333)",
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "bp",
        "level": 6,
        "Difficulty": 10,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Terrifyingly Efficient",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, remove all Stage I Cards.",
            "InvDeck": [{ e: 1, x: { a: 'r', t: '?' }}],
            "invSetup": [{ e:1, $:{r:'?'} }],
            "Summary": "Remove all Stage I",
            "ExtraText": "(New Deck Order: 3-222-3333)",
            "ReplacementKey": null,
            "adv": "bp",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "eng",
    "ShortName": "England",
    "LongName": "The Kingdom of England",
    "BaseDifficulty": 1,
    "Set": "base",
    "LossCondition": "Proud & Mighty Capital",
    "LossConditionText": "If 7 or more [Town]/[City] are ever in a single land, the Invaders win.",
    "EscalationName": "Building Boom",
    "EscalationOrder": "before",
    "EscalationText": "On each board with [Town]/[City], build in the land with the most [Town]/[City].",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "eng",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Indentured Servants Earn Land",
            "EffectType": "build-step",
            "EffectText": "Build Actions affect lands without Invaders, if they are adjacent to at least 2 [Town]/[City] before the Build Action.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "eng",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "eng",
        "level": 2,
        "Difficulty": 4,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Criminals and Malcontents",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board add 1 [City] to land #1, and 1 [Town] to land #2.",
            "Summary": "[City] #1; [Town] #2",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "eng",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "eng",
        "level": 3,
        "Difficulty": 6,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "High Immigration (I)",
            "EffectType": "general-setup",
            "EffectText": "Put the \"High Immigration\" tile on the Invader Board, to the left of \"Ravage\". The invaders take this Build Action each Invader Phase before Ravaging. Cards slide left from Ravage to it, and from it to the discard pile. Remove the tile when a Stage II card slides onto it, putting that card in the discard.",
            "Summary": "High Immigration\n(Removed at Stage Ⅱ)",
            "ExtraText": null,
            "ReplacementKey": "high-immigration",
            "adv": "eng",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "eng",
        "level": 4,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 2,
        "effects": [
          {
            "EffectName": "High Immigration (full)",
            "EffectType": "general-setup",
            "EffectText": "Put the \"High Immigration\" tile on the Invader Board, to the left of \"Ravage\". The invaders take this Build Action each Invader Phase before Ravaging. Cards slide left from Ravage to it, and from it to the discard pile. The extra Build tile remains out the entire game.",
            "Summary": "High Immigration\n(All Game)",
            "ExtraText": null,
            "ReplacementKey": "high-immigration",
            "adv": "eng",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "eng",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 2,
        "effects": [
          {
            "EffectName": "Local Autonomy",
            "EffectType": "always",
            "EffectText": "[Town]/[City] have +1 Health.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "eng",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "eng",
        "level": 6,
        "Difficulty": 11,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Independent Resolve",
            "EffectType": "fear-pool-setup",
            "EffectText": "Add 1 additional [Fear] to the Fear Pool per player in the fame.",
            "Summary": "Fear Pool: +1 [Fear] / player",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "eng",
            "lvl": 6
          },
          {
            "EffectName": "Independent Resolve",
            "EffectType": "fear-step",
            "EffectText": "During any Invader Phase where you resolve no Fear Cards, perform the Build from High Immigration twice.",
            "Summary": "No Fear Card ⇒ Extra High Immigration",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "eng",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "swe",
    "ShortName": "Sweden",
    "LongName": "The Kingdom of Sweden",
    "BaseDifficulty": 1,
    "Set": "base",
    "LossCondition": "None",
    "LossConditionText": null,
    "EscalationName": "Swayed by the Invaders",
    "EscalationOrder": "after-action",
    "EscalationText": "After Invaders Explore into each land this Phase, if that land has at least as many Invaders as [Dahan], replace 1 [Dahan] with 1 [Town].",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "swe",
        "level": 1,
        "Difficulty": 2,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Heavy Mining",
            "EffectType": "ravage-step",
            "EffectText": "If the Invaders do at least 6 Damage to the land during Ravage, add an extra [Blight].",
            "Summary": null,
            "ExtraText": "(This does not cause extra cascades / [Presence] destruction.)",
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "swe",
        "level": 2,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Population Pressure at Home",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board add 1 [City] to land #4. On boards where land #4 starts with [Blight], put that [Blight] in land #5 instead.",
            "Summary": "[City] #4, [Blight]#4→#5",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "swe",
        "level": 3,
        "Difficulty": 5,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Fine Steel for Tools and Guns",
            "EffectType": "always",
            "EffectText": "[Town] deal 3 Damage. [City] deal 5 Damage.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "swe",
        "level": 4,
        "Difficulty": 6,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Setup",
            "EffectType": "setup-final",
            "EffectText": "At the end of Setup (after resolving the initial Explore Card), Accelerate the Invader Deck. On each board, add 1 [Town] to the land of the discarded terrain with the fewest Invaders.",
            "Summary": "Accelerate: [Town] in that terrain with fewest Invaders.",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "swe",
        "level": 5,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Mining Rush",
            "EffectType": "ravage-step",
            "EffectText": "When Ravaging adds at least 1 [Blight] to a land, also add 1 [Town] to an adjacent land without [Town]/[City]. Cascading [Blight] does not cause this effect.",
            "Summary": "[Blight] ⇒ [Town] adjacent w/o [Town]/[City]",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "swe",
        "level": 6,
        "Difficulty": 8,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 2,
        "effects": [
          {
            "EffectName": "Prospecting Outpost",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board add 1 [Town] and 1 [Blight] to land #8. The [Blight] comes from the box, not the Blight Card.",
            "Summary": "[Town],[Blight] #8",
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "swe",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "fra",
    "ShortName": "France",
    "LongName": "The Kingdom of France (Plantation Colony)",
    "BaseDifficulty": 2,
    "Set": "bc",
    "LossCondition": "Sprawling Plantations",
    "LossConditionText": "Before Setup, return all but 7 [Town] per player to the box. Invaders win if you ever cannot place a [Town].",
    "EscalationName": "Demand for New Cash Crops",
    "EscalationOrder": "after-step",
    "EscalationText": "After Exploring, on each board, pick a land of the shown terrain. If it has [Town]/[City], add 1 [Blight]. Otherwise, add 1 [Town].",
    "SpecialCombine": "If playing vs. France Level 2 or higher, increase the pool of available [Town] by 1 per player for each level of the other Adversary being played.",
    "levels": [
      {
        "adv": "fra",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Frontier Explorers",
            "EffectType": "explore-step",
            "EffectText": "Except during Setup: After Invaders successfully Explore into a land which had no [Town]/[City], add 1 [Explorer] there.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "fra",
        "level": 2,
        "Difficulty": 5,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Slave Labour",
            "EffectType": "event-setup",
            "EffectText": "During Setup, put the \"Slave Rebellion\" Event under the top 3 cards of the Event Deck.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 2
          },
          {
            "EffectName": "Slave Labour",
            "EffectType": "build-step",
            "EffectText": "After Invaders Build in a land with 2 [Explorer] or more, replace all but 1 [Explorer] there with an equal number of [Town].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "fra",
        "level": 3,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Early Plantations",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board add 1 [Town] to the highest-numbered land without [Town]. Add 1 [Town] to land #1.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "fra",
        "level": 4,
        "Difficulty": 8,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Triangle Trade",
            "EffectType": "build-step",
            "EffectText": "Whenever Invaders Build a Coastal [City], add 1 [Town] to the adjacent land with the fewest [Town].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "fra",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Slow-Healing Ecosystem",
            "EffectType": "always",
            "EffectText": "[Blight] that would go to the Blight Card from the island is put here instead. As soon as you have 3 [Blight] per player here, put it all on the Blight Card.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "fra",
        "level": 6,
        "Difficulty": 10,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 2,
        "effects": [
          {
            "EffectName": "Persistent Explorers",
            "EffectType": "initial-explore+explore-step",
            "EffectText": "Setup and During the Explore Step: After resolving an Explore card, on each board: Add 1 [Explorer] in a land with no [Explorer].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 6
          },
          {
            "EffectName": "Persistent Explorers",
            "EffectType": "fear-step",
            "EffectText": "During Play: Fear Cards don't remove [Explorer] – when one would, you may instead push that [Explorer].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "fra",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "hlc",
    "ShortName": "Habsburg Livestock",
    "LongName": "The Habsburg Monarchy (Livestock Colony)",
    "BaseDifficulty": 2,
    "Set": "je",
    "LossCondition": "Irreparable Damage",
    "LossConditionText": "Track how many [Blight] come off the Blight Card during Ravage Actions that do 8+ Damage tot he land. If that number ever exceeds players, the Invaders win.",
    "EscalationName": "Seek Prime Territory",
    "EscalationOrder": "after-step",
    "EscalationText": "After the Explore Step: On each board with 4 or fewer [Blight], add 1 [Town] to a land without [Town]/[Blight]. On each board with 2 or fewer [Blight], do so again.",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "hlc",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Migratory Herders",
            "EffectType": "after-build-step",
            "EffectText": "After the normal Build Step: In each land matching a Build Card, Gather 1 [Town] from a land not matching a build card. (In board/land order.)",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "hlc",
        "level": 2,
        "Difficulty": 5,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": -1,
        "effects": [
          {
            "EffectName": "More Rural Than Urban",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board, add 1 [Town] to land #2 and 1 [Town] to the highest-numbered land without Setup symbols.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 2
          },
          {
            "EffectName": "More Rural Than Urban",
            "EffectType": "build-step",
            "EffectText": "During Play, when Invaders would Build 1 [City] in an Inland land, they instead build 2 [Town].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "hlc",
        "level": 3,
        "Difficulty": 6,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Fast Spread",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, Remove 1 additional Stage I Card.",
			"InvDeck": [{ a: 'r', t: '1#1' }],
            "invSetup": [{ r: [1,1] }],
            "Summary": null,
            "ExtraText": "(New deck order: 11-2222-33333)",
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "hlc",
        "level": 4,
        "Difficulty": 8,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Herds Thrive in Verdant Lands",
            "EffectType": "always",
            "EffectText": "[Town] in lands without [Blight] are Durable: they have +2 Health, and \"Destroy [Town]\" effects instead deal 2 Damage per [Town] they could Destroy. (To those [Town] only. \"Destroy all [Town]\" works normally.)",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "hlc",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 3,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Wave of Immigration",
            "EffectType": "invader-deck",
            "EffectText": "Before the initial Explore, put the Habsburg Reminder Card under the top 5 Invader Cards. When revealed, on each board, add 1 [City] to a Coastal land without [City] and 1 [Town] to the 3 Inland lands with the fewest [Blight].",
			"InvDeck": [{ a: 'a', b: '@#5', n: 'H' }],
            "invSetup": [{m:"H", b:[,5]}],
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "hlc",
        "level": 6,
        "Difficulty": 10,
        "Fear1": 2,
        "Fear2": 3,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Far-Flung Herds",
            "EffectType": "ravage-step",
            "EffectText": "Ravages do +2 Damage (total) if any adjacent lands have [Town].",
            "Summary": null,
            "ExtraText": "(This does not cause lands without Invaders to Ravage.)",
            "ReplacementKey": null,
            "adv": "hlc",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "rus",
    "ShortName": "Russia",
    "LongName": "The Tsardom of Russia",
    "BaseDifficulty": 1,
    "Set": "je",
    "LossCondition": "Hunters Swarm the Island",
    "LossConditionText": "Put [Beasts] Destroyed by Advesary rules on this panel. If there are ever more [Beasts] on this panel than on the island, the Invaders win.",
    "EscalationName": "Stalk the Predators",
    "EscalationOrder": "before",
    "EscalationText": "On each board: Add 2 [Explorer] (total) among lands with [Beasts]. If you can't, instead add 2 [Explorer] among lands with [Beasts] on a different board.",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "rus",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Hunters Seek Shell and Hide",
            "EffectType": "island-setup",
            "EffectText": "During Setup, on each board, add 1 [Beasts] and 1 [Explorer] to the highest-numbered land without [Town]/[City].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 1
          },
          {
            "EffectName": "Hunters Seek Shell and Hide",
            "EffectType": "always",
            "EffectText": "During Play, [Explorer] do +1 Damage.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 1
          },
          {
            "EffectName": "Hunters Seek Shell and Hide",
            "EffectType": "ravage-step",
            "EffectText": "When Ravage adds [Blight] to a land (including cascades), Destroy 1 [Beasts] in that land.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "rus",
        "level": 2,
        "Difficulty": 4,
        "Fear1": 1,
        "Fear2": 0,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "A Sense for Impending Disaster",
            "EffectType": "always",
            "EffectText": "The first time each Action would Destroy [Explorer]: If possible, 1 of those [Explorer] is instead Pushed; 1 [Fear] when you do so.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "rus",
        "level": 3,
        "Difficulty": 6,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Competition Among Hunters",
            "EffectType": "ravage-step",
            "EffectText": "Ravage Cards also match lands with 3 or more [Explorer].",
            "Summary": null,
            "ExtraText": "(If the land already matched the Ravage Card, it still Ravages just once.)",
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "rus",
        "level": 4,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Accelerated Exploitation",
            "EffectType": "invader-deck",
            "EffectText": "When making the Invader Deck, put 1 Stage III Card after each Stage II Card.",
            "InvDeck": [{ e: 2, x: {a: 'm', m: '3#b', b:'?'} }],
            "invSetup": [{ e: 2, $: {m:[3,-1], b:"?"} }],
			"Summary": null,
            "ExtraText": "(New deck order: 111-2-3-2-3-2-3-2-33)",
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "rus",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Entrench in the Face of Fear",
            "EffectType": "fear-deck",
            "EffectText": "Put an unused Stage II Invader Card under the top 3 Fear Cards, and an unused Stage III Card under the top 7 Fear Cards. When one is revealed, immediately place it in the Build space (face-up).",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "rus",
        "level": 6,
        "Difficulty": 11,
        "Fear1": 2,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Pressure for Fast Profit",
            "EffectType": "after-ravage-step",
            "EffectText": "After the Ravage Step of tun 2+, on each board where it added no [Blight]: In the land with the most [Explorer] (min. 1), add 1 [Explorer] and 1 [Town].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "rus",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "sco",
    "ShortName": "Scotland",
    "LongName": "The Kingdom of Scotland",
    "BaseDifficulty": 1,
    "Set": "ff",
    "LossCondition": "Trade Hub",
    "LossConditionText": "If the number of Coastal lands with [City] is ever greater than (2 × # of boards), the Invaders win.",
    "EscalationName": "Ports Sprawl Outward",
    "EscalationOrder": "before",
    "EscalationText": "(Before Exploring) On the single board with the most Coastal [Town]/[City], add 1 [Town] to the N lands with the fewest [Town]. (N = # of players.)",
    "SpecialCombine": "If the other Adversary's Setup instructions would add [City] to a Coastal land other than land #2, instead add the [City] to an adjacent Inland land.",
    "levels": [
      {
        "adv": "sco",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Trading Port",
            "EffectType": "explore-step",
            "EffectText": "During Play, in Coastal lands, Explore Cards add 1 [Town] instead of 1 [Explorer]. \"Coastal Lands\" Invader Cards do this for a maximum of 2 lands per board.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "sco",
        "level": 2,
        "Difficulty": 4,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Seize Opportunity",
            "EffectType": "island-setup",
            "EffectText": "During Setup, add 1 [City] to land #2.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 2
          },
          {
            "EffectName": "Seize Opportunity",
            "EffectType": "invader-deck",
            "EffectText": "Place \"Coastal Lands\" as the 3rd Stage II Card, and move the two Stage II Cards above it up by one.",
			"InvDeck": [{ a:'r', t:'2#3', n: 'C' }, { a: 'm', m: '2#1', u: 1 }, { a: 'm', m: '2#2', u: 1 }],
            "invSetup": [{m:"C", r:[2,3]}, {m:[2,1], d:-1}, {m:[2,2], d:-1}],
            "Summary": null,
            "ExtraText": "(New deck order: 11-22-1-C2-33333, where C is the Stage II Coastal Lands Card.)",
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "sco",
        "level": 3,
        "Difficulty": 6,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Chart the Coastline",
            "EffectType": "build-step",
            "EffectText": "In Coastal lands, Build Cards affec lands without Invaders, as long as there is an adjacent [City].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "sco",
        "level": 4,
        "Difficulty": 7,
        "Fear1": 2,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Ambition of a Minor Nation",
            "EffectType": "invader-deck",
            "EffectText": "During Setup, replace the bottom Stage I Card with the bottom Stage III Card.",
			"InvDeck": [{ a:'r', t:'1#b', f:'3#b' }],
            "invSetup": [{r:[1,-1], m:[3,-1]}],
            "Summary": null,
            "ExtraText": "(New deck order: 11-22-3-C2-3333)",
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "sco",
        "level": 5,
        "Difficulty": 8,
        "Fear1": 2,
        "Fear2": 3,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Runoff and Bilgewater",
            "EffectType": "ravage-step",
            "EffectText": "After a Ravage Action add [Blight] to a Coastal land, add 1 [Blight] to that board's Ocean (without cascading). Treat the Ocean as a Coastal Wetland for this rule and for [Blight] removal/movement.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "sco",
        "level": 6,
        "Difficulty": 10,
        "Fear1": 3,
        "Fear2": 3,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Exports Fuel Inward Growth",
            "EffectType": "after-ravage-step",
            "EffectText": "After the Ravage Step, add 1 [Town] to each Inland land that matches a Ravage Card and is within [Range:1] of [Town]/[City].",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "sco",
            "lvl": 6
          }
        ]
      }
    ]
  },
  {
    "Code": "hme",
    "ShortName": "Habsburg Mining",
    "LongName": "Habsburg Mining Expedition",
    "BaseDifficulty": 1,
    "Set": "ni",
    "LossCondition": "Land Stripped Bare",
    "LossConditionText": "At the end of the [Fast] Phase, the Invaders win if any land has at least 8 total Invaders/[Blight] (combined).",
    "EscalationName": "Mining Tunnels",
    "EscalationOrder": "advance",
    "EscalationText": "After Advancing Invader Cards: On each board, Explore in 2 lands whose terrains don't match a Ravage or Build Card (no source required).",
    "SpecialCombine": null,
    "levels": [
      {
        "adv": "hme",
        "level": 1,
        "Difficulty": 3,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 0,
        "effects": [
          {
            "EffectName": "Avarice Rewarded",
            "EffectType": "ravage-step",
            "EffectText": "When [Blight] added by a Ravage Action would cascade, instead Upgrade 1 [Explorer]/[Town] (before [Dahan] counterattack).",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hme",
            "lvl": 1
          },
          {
            "EffectName": "Ceaseless Mining",
            "EffectType": "build-step",
            "EffectText": "Lands with 3 or more invaders are Mining lands. In Mining lands: • [Disease] and modifiers to [Disease] affect Ravage Actions as though they were Build Actions. • During the Build Step, Build Cards cause Ravage Actions instead of Build Actions.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hme",
            "lvl": 1
          }
        ]
      },
      {
        "adv": "hme",
        "level": 2,
        "Difficulty": 4,
        "Fear1": 0,
        "Fear2": 0,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Miners Come From Far and Wide",
            "EffectType": "island-setup",
            "EffectText": "Setup: Add 1 [Explorer] in each land with no [Dahan]. Add 1 [Disease] and 1 [City] in the highest-numbered land with a [Town] Setup symbol.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hme",
            "lvl": 2
          }
        ]
      },
      {
        "adv": "hme",
        "level": 3,
        "Difficulty": 5,
        "Fear1": 0,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Mining Boom (I)",
            "EffectType": "after-build-step",
            "EffectText": "After the Build Step, on each board: Choose a land with [Explorer]. Upgrade 1 [Explorer] there.",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": "mining-boom",
            "adv": "hme",
            "lvl": 3
          }
        ]
      },
      {
        "adv": "hme",
        "level": 4,
        "Difficulty": 7,
        "Fear1": 1,
        "Fear2": 1,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Untapped Salt Deposits",
            "EffectType": "invader-deck",
            "EffectText": "Setup: Remove the Stage II 'Coastal Lands' card before randomly choosing Stage II Cards. Place the 'Salt Deposits' card in place of the 2nd Stage II card.",
            "InvDeck": [{ a: 'r', t: '2#2', n: 'S' }],
            "invSetup": [{x:'C'},{m:"S", r: [2,2]}],
			"Summary": null,
            "ExtraText": "(New Deck Order: 111-2S22-33333, where S is the Salt Deposits card. Escalation ignores S.)",
            "ReplacementKey": null,
            "adv": "hme",
            "lvl": 4
          }
        ]
      },
      {
        "adv": "hme",
        "level": 5,
        "Difficulty": 9,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "Mining Boom (II)",
            "EffectType": "after-build-step",
            "EffectText": "Instead of Mining Boom (I), after the Build Step, on each board: Choose a land with [Explorer]. Build there, then Upgrade 1 [Explorer].",
            "Summary": null,
            "ExtraText": "(Build normally in a Mining land.)",
            "ReplacementKey": "mining-boom",
            "adv": "hme",
            "lvl": 5
          }
        ]
      },
      {
        "adv": "hme",
        "level": 6,
        "Difficulty": 10,
        "Fear1": 1,
        "Fear2": 2,
        "Fear3": 1,
        "effects": [
          {
            "EffectName": "The Empire Ascendant",
            "EffectType": "initial-explore+explore-step",
            "EffectText": "Setup and During the Explore Step: On boards with 3 or fewer [Blight]: Add +1 [Explorer] in each land successfully explored. (Max 2 lands per board per Explore Card.)",
            "Summary": null,
            "ExtraText": null,
            "ReplacementKey": null,
            "adv": "hme",
            "lvl": 6
          }
        ]
      }
    ]
  }
];
