window.Constants = {
    monsters: [
        {
            type: 'monster',
            id: 'slime',
            name: 'Slime',
            hp: 2,
            ap: 1,
            image: 'slime',
            level: 1,
            card: 'card',
            xp: 1
        },
        {
            type: 'monster',
            id: 'bat',
            name: 'Bat',
            hp: 3,
            ap: 1,
            image: 'bat',
            level: 1,
            card: 'card',
            xp: 2
        },
        {
            type: 'monster',
            id: 'demon-rat',
            name: 'Demon Rat',
            hp: 5,
            ap: 1,
            image: 'demon-rat',
            level: 3,
            card: 'card',
            xp: 3
        },
        {
            type: 'monster',
            id: 'zombie',
            name: 'Zombie',
            hp: 8,
            ap: 2,
            image: 'zombie',
            level: 5,
            card: 'card',
            xp: 5
        },
        {
            type: 'monster',
            id: 'skeleton',
            name: 'Skeleton',
            hp: 10,
            ap: 3,
            image: 'skeleton',
            level: 6,
            card: 'card',
            xp: 8
        },
        {
            type: 'monster',
            id: 'shaman',
            name: 'Shaman',
            hp: 10,
            ap: 2,
            image: 'shaman',
            level: 6,
            card: 'card',
            xp: 8
        }
    ],
    characters: {
        paladin: {
            id: 'paladin',
            name: 'Paladin',
            hp: 30,
            maxHP: 30,
            ap: 3,
            image: 'paladin',
            card: 'card',
            slots: 2,
            xp: 0,
            level: 1,
            levelUpPts: 0,
            levelUpStages: [5, 10, 20, 40, 60, 80, 100, 200, 400, 600, 800, 1000]
        },
        wizard: {
            id: 'wizard',
            name: 'Wizard',
            hp: 20,
            maxHP: 20,
            ap: 2,
            image: 'wizard',
            card: 'card',
            slots: 3,
            xp: 0,
            level: 1,
            levelUpPts: 0,
            levelUpStages: [5, 10, 20, 40, 60, 80, 100, 200, 400, 600, 800, 1000]
        }
    },
    items: [
        {
            type: 'weapon',
            id: 'knife',
            name: 'Knife',
            image: 'knife',
            ap: 1,
            card: 'card'
        },
        {
            type: 'weapon',
            id: 'short-sword',
            name: 'Short sword',
            image: 'short-sword',
            ap: 3,
            hp: 0,
            card: 'card'
        },
        {
            type: 'weapon',
            id: 'long-sword',
            name: 'Long sword',
            image: 'long-sword',
            ap: 5,
            hp: 0,
            card: 'card',
            level: 3
        },
        {
            type: 'weapon',
            id: 'hand-axe',
            name: 'Hand axe',
            image: 'hand-axe',
            ap: 5,
            hp: 0,
            card: 'card',
            level: 2
        },
        {
            type: 'weapon',
            id: 'broad-sword',
            name: 'Broad sword',
            image: 'broad-sword',
            ap: 8,
            hp: 0,
            card: 'card',
            level: 6
        },
        {
            type: 'weapon',
            id: 'war-hammer',
            name: 'War hammer',
            image: 'war-hammer',
            ap: 10,
            hp: 0,
            card: 'card',
            level: 8
        },
        {
            type: 'weapon',
            id: 'staff',
            name: 'Staff',
            image: 'staff',
            ap: 2,
            hp: 0,
            card: 'card'
        },
        {
            type: 'buff',
            id: 'healing-touch',
            name: 'Healing touch',
            image: 'healing-touch',
            ap: 0,
            hpi: 3,
            text: '+3 to health',
            card: 'consumable-card'
        },
        {
            type: 'consumable',
            id: 'health-vial',
            name: 'Health vial',
            image: 'health-vial',
            hpi: 5,
            level: 0,
            text: '+5 to health',
            card: 'consumable-card'
        },
        {
            type: 'consumable',
            id: 'strength-serum',
            name: 'Strength serum',
            image: 'strength-serum',
            api: 1,
            level: 0,
            text: '+1 to attack',
            card: 'consumable-card'
        },
        {
            type: 'consumable',
            id: 'health-bottle',
            name: 'Health bottle',
            image: 'health-bottle',
            hpi: 10,
            level: 3,
            text: '+10 to health',
            card: 'consumable-card'
        },
        {
            type: 'consumable',
            id: 'strength-bottle',
            name: 'Strength bottle',
            image: 'strength-bottle',
            api: 2,
            level: 3,
            text: '+2 to attack',
            card: 'consumable-card'
        },
    ],
    levels: [
        {
            numEncounters: 5
        }
    ]
}