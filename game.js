window.Game = class Game {
    constructor () {
        this.currentLevel = null;
        this.level = 0;
        this.turn = 0;
        this.numEncounter = 0;
        this.board = document.querySelector ('#board');
        this.activeRow = document.querySelector ('#active-row');
        this.playerSlot = document.querySelector ('#player');
        this.itemsRow = document.querySelector ('#items');
        this.inventorySlots = document.querySelector ('#inventory .body');
        this.msgs = document.querySelector ('#msgs .body');
        this.xpBar = document.querySelector ('#player #stats #xp-bar');
        this.levelNum = document.querySelector ('#player #stats #level-num');
        this.xpNum = document.querySelector ('#player #stats #xp-num');
        this.player = null;
        this.inventory = [];
        this.slots = [];
        this.slotCards = [];
        this.currentMonsters = [];
        this.mode = 'card-selection';
        this.currentArrowHandler = null;
        this.playArrow = null;
        this.currentPlayingItem = null;
        this.currentPlayingItemIdx = -1;
        this.audioClick = document.querySelector ('#audio-click');
        this.audioHit = document.querySelector ('#audio-hit');

        this.audioClick.volume = 0.5;
        this.audioHit.volume = 0.5;

        this.board.addEventListener ('click', (ev) => {
            if ((this.mode === 'card-playing' || this.mode === 'buff-playing' || this.mode === 'inventory-changing') && !ev.srcElement.classList.contains('card')) {
                this.mode = 'card-play';
                this.currentPlayingItem.setActive (false);
                this.currentPlayingItem = null;
                this.currentPlayingItemIdx = -1;
                this.destroyArrow ();
            }
        });

        this.inventorySlots.addEventListener ('click', (ev) => {
            if (this.mode === 'monster-consumable-playing') {
                let slotNode = ev.srcElement;
                let idx = +slotNode.getAttribute ('x-idx');
                this.currentPlayingItem.setActive (false);
                
                if (!this.inventory [idx]) {
                    this.moveCardToInventory (idx);   
                } else {
                    this.currentPlayingItem.setActive (false);
                    this.currentPlayingItem = null;
                    this.destroyArrow ();
                    this.mode = 'card-play';
                }
            }
        });

        this.itemsRow.addEventListener ('click', (ev) => {
            if (this.mode === 'inventory-changing') {
                let slot;
                if (ev.srcElement.classList.contains ('card')) {
                    slot = ev.srcElement.parentElement;
                } else if (ev.srcElement.classList.contains ('slot')) {
                    slot = ev.srcElement;
                } else {
                    return;
                }
                let idx = +slot.getAttribute ('x-idx');

                if (this.slotCards [idx]) {
                    this.currentPlayingItem.setActive (false);
                    let tempItem = this.currentPlayingItem;
                    let inventorySlot = +tempItem.node.parentElement.getAttribute ('x-idx');
                    this.currentPlayingItem = this.slotCards [idx];
                    this.moveCardToInventory (inventorySlot);
                    this.currentPlayingItem = tempItem;
                    this.moveItemToSlot (idx);
                } else {
                    let inventorySlot = +this.currentPlayingItem.node.parentElement.getAttribute ('x-idx');
                    this.currentPlayingItem.setActive (false);
                    this.moveItemToSlot (idx);
                    this.inventory [inventorySlot] = null;
                }

                setTimeout (() => {
                    this.nextTurn ();
                }, 300);
            }
        });
    }

    addMsg (text) {
        let node = document.createElement ('div');
        node.classList.add ('msg');
        node.innerText = text;
        this.msgs.appendChild (node);
        this.msgs.scrollTop = this.msgs.scrollHeight;
    }

    start (playerType) {
        this.player = new Card ({
            props: Constants.characters [playerType],
            type: 'player'
        });
        this.initStartingItems (playerType)
        this.player.create ();
        this.currentLevel = Constants.levels [this.level];
        this.startEncounter ();
    }

    initStartingItems (playerType) {
        for (let i=0; i<this.player.props.slots; i++) {
            let slot = document.createElement ('div');
            slot.classList.add ('slot');
            slot.setAttribute ('x-idx', i);
            this.itemsRow.appendChild (slot);
        }

        if (playerType === 'paladin') {
            this.putItemInSlot ('short-sword', 0);
        } else if (playerType === 'wizard') {
            this.putItemInSlot ('staff', 0);
            this.putItemInSlot ('healing-touch', 1);
        }
    }

    moveCardToInventory (idx) {
        let currentPlayingItem = this.currentPlayingItem;
        this.destroyArrow ();
        let inventoryNode = this.inventorySlots.children [idx];
        
        let p1 = currentPlayingItem.getNodeCenter ();
        let p2 = {
            x: inventoryNode.getBoundingClientRect ().left + inventoryNode.getBoundingClientRect ().width / 2,
            y: inventoryNode.getBoundingClientRect ().top + inventoryNode.getBoundingClientRect ().height / 2 
        };
        let a = p2.x - p1.x;
        let b = p2.y - p1.y;

        currentPlayingItem.node.style.transform = `translate(${a}px,${b}px)`;

        this.putCardInInventory (idx, currentPlayingItem);

        setTimeout (() => {
            inventoryNode.appendChild (currentPlayingItem.node);
            currentPlayingItem.node.style.transform = ``;
            this.mode = 'card-play';
            currentPlayingItem.options.type = 'inventory-item';
            this.currentMonsters = _.without (this.currentMonsters, currentPlayingItem);
            this.currentPlayingItem = null;
            this.nextTurn ();
        }, 300);
    }

    putCardInInventory (idx, card) {
        this.inventory [idx] = card;
    }

    putItemInSlot (id, idx) {
        let item = _.clone (_.find (Constants.items, { id }));
        
        if (item) {
            let slots = _.compact (this.slots);

            if (slots.length < this.player.props.slots) {
                this.slots [idx] = item;
                this.slotCards [idx] = new Card ({
                    props: item,
                    type: 'item'
                });
                this.slotCards [idx].create (idx);
            }
        }
    }

    moveItemToSlot (idx) {
        let currentPlayingItem = this.currentPlayingItem;
        this.destroyArrow ();
        let slotNode = this.itemsRow.children [idx];
        
        let p1 = currentPlayingItem.getNodeCenter ();
        let p2 = {
            x: slotNode.getBoundingClientRect ().left + slotNode.getBoundingClientRect ().width / 2,
            y: slotNode.getBoundingClientRect ().top + slotNode.getBoundingClientRect ().height / 2 
        };
        let a = p2.x - p1.x;
        let b = p2.y - p1.y;

        currentPlayingItem.node.style.transform = `translate(${a}px,${b}px)`;

        this.slotCards [idx] = currentPlayingItem;
        let invIdx = _.findIndex (this.inventory, currentPlayingItem);
        this.inventory [invIdx] = null;

        setTimeout (() => {
            slotNode.appendChild (currentPlayingItem.node);
            currentPlayingItem.node.style.transform = ``;
            this.mode = 'card-play';
            currentPlayingItem.options.type = 'item';
            this.currentPlayingItem = null;
            if (this.currentMonsters.length === 0) {
                this.startEncounter ();
            } else {
                this.mode = 'card-play';
            }
        }, 300);
    }

    showPlayArrow (uuid) {
        let playArrow = document.createElement ('div');
        let itemCardLeft = this.itemsRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().left;
        let itemCardCenter = this.itemsRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().top + this.itemsRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().height / 2;
        let boardLeft = this.board.getBoundingClientRect ().left;
        playArrow.classList.add ('play-arrow');
        playArrow.style.left =  itemCardLeft - boardLeft + 56 + 'px';

        this.playArrow = playArrow;
        this.board.appendChild (playArrow);

        this.currentArrowHandler = (ev) => {
            let x1 = itemCardLeft + 56;
            let y1 = itemCardCenter;
            let x2 = ev.clientX;
            let y2 = ev.clientY;
            let a = x2 - x1;
            let b = y2 - y1;
            let angle = Math.atan2(b, a) * 180 / Math.PI;
            let distance = Math.sqrt (a * a + b * b);

            playArrow.style.height = distance + 'px';
            playArrow.style.transform = `translateX(-50%) rotate(${angle + 90}deg)`;
        };

        this.board.addEventListener ('mousemove', this.currentArrowHandler);
    }

    showMonsterConsumableArrow (uuid) {
        let playArrow = document.createElement ('div');
        let itemCardLeft = this.activeRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().left;
        let itemCardCenter = this.activeRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().top + this.activeRow.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().height / 2;
        let boardLeft = this.board.getBoundingClientRect ().left;
        let boardBottom = this.board.getBoundingClientRect ().bottom;
        playArrow.classList.add ('play-arrow');
        playArrow.style.left =  itemCardLeft - boardLeft + 56 + 'px';
        playArrow.style.bottom = boardBottom - itemCardCenter + 'px';

        this.playArrow = playArrow;
        this.board.appendChild (playArrow);

        this.currentArrowHandler = (ev) => {
            let x1 = itemCardLeft + 56;
            let y1 = itemCardCenter;
            let x2 = ev.clientX;
            let y2 = ev.clientY;
            let a = x2 - x1;
            let b = y2 - y1;
            let angle = Math.atan2(b, a) * 180 / Math.PI;
            let distance = Math.sqrt (a * a + b * b);

            playArrow.style.height = distance + 'px';
            playArrow.style.transform = `translateX(-50%) rotate(${angle + 90}deg)`;
        };

        this.board.addEventListener ('mousemove', this.currentArrowHandler);
    }

    showInventoryChangeArrow (uuid) {
        let playArrow = document.createElement ('div');
        let itemCardLeft = this.inventorySlots.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().left;
        let itemCardCenter = this.inventorySlots.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().top + this.inventorySlots.querySelector(`[x-uuid='${uuid}']`).getBoundingClientRect ().height / 2;
        let boardLeft = this.board.getBoundingClientRect ().left;
        let boardBottom = this.board.getBoundingClientRect ().bottom;
        playArrow.classList.add ('play-arrow');
        playArrow.style.left =  itemCardLeft - boardLeft + 56 + 'px';
        playArrow.style.bottom = boardBottom - itemCardCenter + 'px';

        this.playArrow = playArrow;
        this.board.appendChild (playArrow);

        this.currentArrowHandler = (ev) => {
            let x1 = itemCardLeft + 56;
            let y1 = itemCardCenter;
            let x2 = ev.clientX;
            let y2 = ev.clientY;
            let a = x2 - x1;
            let b = y2 - y1;
            let angle = Math.atan2(b, a) * 180 / Math.PI;
            let distance = Math.sqrt (a * a + b * b);

            playArrow.style.height = distance + 'px';
            playArrow.style.transform = `translateX(-50%) rotate(${angle + 90}deg)`;
        };

        this.board.addEventListener ('mousemove', this.currentArrowHandler);
    }

    destroyArrow () {
        if (this.playArrow) {
            this.playArrow.remove ();
            this.playArrow = null;
            this.board.removeEventListener ('mousemove', this.currentArrowHandler);
        }
    }

    prepareCardPlay (uuid) {
        this.showPlayArrow (uuid);
        this.currentPlayingItem = _.find (this.slotCards, { uuid });
        if (this.currentPlayingItem.props.type === 'weapon') {
            this.mode = 'card-playing';
        } else {
            this.mode = 'buff-playing';
        }
    }

    prepareMonsterConsumablePlay (uuid) {
        this.showMonsterConsumableArrow (uuid);
        this.mode = 'monster-consumable-playing';
        this.currentPlayingItem = _.find (this.currentMonsters, { uuid });
    }

    prepareInventoryChange (uuid) {
        this.showInventoryChangeArrow (uuid);
        this.mode = 'inventory-changing';
        this.currentPlayingItem = _.find (this.inventory, { uuid });
    }

    cardPlay (uuid) {
        let monster = _.find (this.currentMonsters, { uuid });
        this.destroyArrow ();

        let card = this.currentPlayingItem.node;
        let p1 = this.currentPlayingItem.getNodeCenter ();
        let p2 = monster.getNodeCenter ();
        let a = p2.x - p1.x;
        let b = p2.y - p1.y;
        
        card.style.transform = `translate(${a}px,${b}px) scale(1.2)`;

        setTimeout (() => {
            card.style.transform = '';

            this.currentPlayingItem.setActive (false);
            monster.setActive (false);
            let attackP = -this.currentPlayingItem.props.ap - Math.round (Math.random () * this.player.props.ap)
            if (monster.changeHP (attackP)) {
                this.player.props.xp += monster.props.xp;
                setTimeout (() => {
                    this.currentMonsters = _.filter (this.currentMonsters, (item) => item.uuid !== monster.uuid);
                }, 300);
            }

            this.addMsg (`The ${this.player.props.name} hits the ${monster.props.name} for ${-attackP} hp`)

            let currLvl = this.player.props.level;
            let currXp = this.player.props.xp;
            let nextXp = this.player.props.levelUpStages [currLvl - 1];

            if (currXp >= nextXp) {
                let diffXp = currXp - nextXp;
                currLvl ++;
                this.player.props.level ++;
                nextXp = this.player.props.levelUpStages [currLvl - 1];
                this.player.props.maxHP += 5;
                this.player.props.ap += 1;
                this.addMsg ('Level Up!!');
                this.addMsg (`${this.player.props.name}'s max hp increased to ${this.player.props.maxHP}`)
                this.addMsg (`${this.player.props.name}'s attack increased to ${this.player.props.ap}`)
                this.player.updateCardVals ();
            }

            this.xpBar.style.width = ((currXp / nextXp) * 100) + '%';
            this.levelNum.innerText = currLvl;
            this.xpNum.innerText = `${currXp} / ${nextXp}`


            setTimeout (() => {
                this.mode = 'card-play';
                this.currentPlayingItem = null;
                this.currentPlayingItemIdx = -1;
                this.nextTurn ();
            }, 600);
        }, 200);
    }

    monsterConsumablePlay () {
        this.destroyArrow ();
        if (this.currentPlayingItem.props.hpi) {
            this.currentPlayingItem.die ();
            this.player.changeHP (this.currentPlayingItem.props.hpi);
            this.player.setActive (false);

            setTimeout (() => {
                this.mode = 'card-play';
                this.currentMonsters = _.without (this.currentMonsters, this.currentPlayingItem);
                this.currentPlayingItem = null;
                
                if (this.currentMonsters.length === 0) {
                    this.startEncounter ();
                } else {
                    this.mode = 'card-play';
                }
            }, 300);
        }

        if (this.currentPlayingItem.props.api) {
            this.currentPlayingItem.die ();
            this.player.changeAP (this.currentPlayingItem.props.api);
            this.player.setActive (false);

            setTimeout (() => {
                this.mode = 'card-play';
                this.currentMonsters = _.without (this.currentMonsters, this.currentPlayingItem);
                this.currentPlayingItem = null;
                
                if (this.currentMonsters.length === 0) {
                    this.startEncounter ();
                } else {
                    this.mode = 'card-play';
                }
            }, 300);
        }
    }

    buffPlay () {
        this.destroyArrow ();

        if (this.currentPlayingItem.props.hpi) {
            this.currentPlayingItem.setActive (false);
            this.player.changeHP (this.currentPlayingItem.props.hpi);
            this.player.setActive (false);

            if (this.currentPlayingItem.props.type === 'consumable') {
                this.currentPlayingItem.die ();
                this.slotCards = _.without (this.slotCards, this.currentPlayingItem);
            }

            setTimeout (() => {
                this.mode = 'card-play';
                this.currentPlayingItem = null;
                this.nextTurn ();
            }, 300);
        }

        if (this.currentPlayingItem.props.api) {
            this.currentPlayingItem.setActive (false);
            this.player.changeAP (this.currentPlayingItem.props.api);
            this.player.setActive (false);

            if (this.currentPlayingItem.props.type === 'consumable') {
                this.currentPlayingItem.die ();
                this.slotCards = _.without (this.slotCards, this.currentPlayingItem);
            }

            setTimeout (() => {
                this.mode = 'card-play';
                this.currentPlayingItem = null;
                this.nextTurn ();
            }, 300);
        }
    }

    getRandomMonsterForLevel () {
        return _.clone (_.shuffle (_.filter (Constants.monsters, (item) => item.level <= this.player.props.level)) [0]);
    }

    startEncounter () {
        // if (this.numEncounter >= this.currentLevel.numEncounters) {
        //     this.nextLevel ();
        // } else {
            let numMonsters = Math.floor (Math.random () * Math.floor (this.player.props.level / 2)) + 1;
            let monstersText = {};
            let msg = '';
            for (let i=0; i<numMonsters; i++) {
                let monsterOpts = this.getRandomMonsterForLevel ();
                let monster = {
                    props: monsterOpts,
                    type: 'monster'
                };
                let card = new Card (monster);
                this.currentMonsters.push (card);
                card.create ();
                this.mode = 'card-play';
                
                if (!monstersText [monsterOpts.id]) {
                    monstersText [monsterOpts.id] = {
                        name: monsterOpts.name,
                        count: 1
                    };
                } else {
                    monstersText [monsterOpts.id].count ++;
                }
            }
            let c = 0;
            for (var m in monstersText) {
                if (c > 0) msg += ' and '
                if (monstersText [m].count === 1) {
                    msg += 'a ' + monstersText [m].name
                } else {
                    msg += monstersText [m].count + ' ' + monstersText [m].name + 's';
                }
                c ++;
            }

            if (c > 1) msg += ' appear.';
            else msg += ' appears.'

            this.addMsg (msg);

            this.numEncounter ++;
        // }
    }

    nextTurn () {
        if (this.currentMonsters.length === 0) {
            this.startEncounter ();
        } else {
            this.mode = 'enemy-turn';
            let c = 0;

            if (_.filter(this.currentMonsters, (item) => item.props.type === 'monster').length) {
                let tick = () => {
                    if (c < this.currentMonsters.length) {
                        let monster = this.currentMonsters [c];

                        if (monster.props.type !== 'monster') {
                            c++;
                            setTimeout (tick, 0);
                            return;
                        }

                        let p1 = monster.getNodeCenter ();
                        let p2 = this.player.getNodeCenter ();
                        let a = p2.x - p1.x;
                        let b = p2.y - p1.y;
    
                        monster.node.style.transform = `translate(${a}px,${b}px)`;
                        setTimeout (() => {
                            game.audioHit.play ();
                            monster.node.style.transform = '';
                            this.player.changeHP (-monster.props.ap);
                            this.addMsg (`${monster.props.name} hits the ${this.player.props.name} for ${monster.props.ap} hp`);
                            c++;
                            setTimeout (tick, 600);
                        }, 200);
                    } else {
                        this.mode = 'card-play';
                    }
                };
    
                setTimeout (tick, 600);
            } else {
                this.mode = 'card-play';
            }
        }
    }

    nextLevel () {
        debugger
    }

    placeCard (node, type, idx) {
        if (type === 'player') {
            this.playerSlot.appendChild (node);
        } else if (type === 'monster' || type === 'monster-consumable') {
            this.activeRow.appendChild (node);
        } else if (type === 'item') {
            this.itemsRow.children [idx].appendChild (node);
        }
    }
}