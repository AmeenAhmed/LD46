window.Card = class Card {
    constructor (options) {
        this.options = options;
        this.props = _.clone (options.props);
        this.uuid = Math.floor (Math.random () * Number.MAX_SAFE_INTEGER)
    }

    getNodeCenter () {
        let rect = this.node.getBoundingClientRect ();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    setActive (bool) {
        if (bool) {
            this.node.classList.add ('active');
        } else {
            this.node.classList.remove ('active');
        }
    }

    die () {

        if (this.options.type === 'player') {
            document.querySelector ('#game-over').classList.remove ('hidden');
        }

        this.node.style.pointerEvents = 'none';
        this.node.style.transform = 'scale(0.2)';
        this.node.style.opacity = 0;

        setTimeout (() => {
            this.node.remove ();
        }, 300);

        if (this.props.type === 'monster') {
            let drop = Math.random () < 0.5;

            if (drop) {
                let dropProps = this.getRandomDrop ();
                let dropOpts = {
                    props: dropProps,
                    type: 'monster-consumable'
                };
                let card = new Card (dropOpts);
                game.currentMonsters.push (card);
                card.create ();
                game.mode = 'card-play';
                game.addMsg (`${this.props.name} drops a ${dropProps.name}`);
            }
        }
    }

    getRandomDrop () {
        return _.clone(_.shuffle(_.filter (Constants.items, (item) => item.level <= this.props.level))[0]);
    }

    changeHP (value) {
        this.props.hp += value;

        if (this.props.hp <= 0) {
            setTimeout (() => {
                this.die ();
            }, 300);
            return true;
        } else if (this.props.hp > this.props.maxHP) {
            this.props.hp = this.props.maxHP;
        }

        this.updateCardVals ();

        return false;
    }

    changeAP (value) {
        this.props.ap += value;
        this.updateCardVals ();
    }

    updateCardVals () {
        this.node.querySelector ('#health').innerText = this.props.hp;
        this.node.querySelector ('#attack').innerText = this.props.ap;
    }

    create (idx) {
        this.node = Utils.templates.card (this.props);
        this.node.setAttribute ('x-uuid', this.uuid);
        
        game.placeCard (this.node, this.options.type, idx);

        this.node.addEventListener ('click', (ev) => {
            if (this.options.type === 'item' && game.mode === 'card-play') {
                if (this.props.type === 'weapon') {
                    this.node.classList.add ('active');
                    game.prepareCardPlay (this.uuid);
                } else if (this.props.type === 'buff') {
                    this.node.classList.add ('active');
                    game.prepareCardPlay (this.uuid);
                } else if (this.props.type === 'consumable') {
                    this.node.classList.add ('active');
                    game.prepareCardPlay (this.uuid);
                }
                game.audioClick.play ();
            } else if (this.options.type === 'monster' && game.mode === 'card-playing') {
                this.node.classList.add ('active');
                game.cardPlay (this.uuid);
                game.audioHit.play ();
            } else if (this.options.type === 'monster-consumable' && game.mode === 'card-play') {
                this.node.classList.add ('active');
                game.prepareMonsterConsumablePlay (this.uuid);
                game.audioClick.play ();
            } else if (this.options.type === 'player' && game.mode === 'monster-consumable-playing') {
                this.node.classList.add ('active');
                game.monsterConsumablePlay (this.uuid);
                game.audioClick.play ();
            } else if (this.options.type === 'player' && game.mode === 'buff-playing') {
                this.node.classList.add ('active');
                game.buffPlay (this.uuid);
                game.audioClick.play ();
            } else if (this.options.type === 'inventory-item' && game.mode === 'card-play') {
                this.node.classList.add ('active');
                game.prepareInventoryChange (this.uuid);
                game.audioClick.play ();
            }
        });

        this.node.addEventListener ('dblclick', (ev) => {
            if (this.options.type === 'inventory-item') {
                game.destroyArrow ();
                game.mode = 'card-play';
                this.die ();
                let invIdx = _.findIndex (game.inventory, this);
                game.inventory [invIdx] = null;
                game.currentPlayingItem = null;
            }
        });
    }
}