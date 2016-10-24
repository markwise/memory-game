import Backbone from 'backbone';
import Events from 'scripts/events';
import Card from 'views/card/Card';
import shuffle from 'scripts/shuffle';
import template from './cardManager.njk';


export default Backbone.View.extend({
    className: 'CardManager',

    initialize(options) {
        this._cardDeck = options.cardDeck;
        this._cards = [];
        this._selectedCards = [];

        this.listenTo(Events, 'NEW_GAME', () => {
            this.__removeCards();
            shuffle(this._cardDeck);
            this.render();
        });

        this.listenTo(Events, 'CARD_SELECTED', (card) => {
            let selectedCards = this._selectedCards;
            selectedCards.push(card);

            if (selectedCards.length >= 2) {
                this.__toggleCardEvents();
                let cardId1 = selectedCards[0].getCardId();
                let cardId2 = selectedCards[1].getCardId();

                if (cardId1 === cardId2) {
                    Events.trigger('INCREMENT_MATCH_COUNT');

                    setTimeout(() => {
                        this.__hideMatchedCards();
                        this.__removeSelectedCards();
                        this.__toggleCardEvents();
                    }, 2000);

                } else {
                    setTimeout(() => {
                        this.__resetSelectedCards();
                        this.__removeSelectedCards();
                        this.__toggleCardEvents();
                    }, 2000);
                }

                Events.trigger('INCREMENT_GUESS_COUNT');
            }
        });
    },


    render(context={data:{}}) {
        let el = this.el;
        let fragment = document.createDocumentFragment();

        this._cardDeck.forEach((cardId) => {
            let card = new Card({cardId: cardId});
            this._cards.push(card);
            fragment.appendChild(card.render().el);
        });

        el.innerHTML = '';
        el.appendChild(fragment);
        return this;
    },


    __removeCards() {
        this._cards.forEach((card) => {
            card.remove();
        });

        this._cards.length = 0;
    },


    __toggleCardEvents() {
        this.el.classList.toggle('CardManager--disabled');
    },


    __resetSelectedCards() {
        this._selectedCards.forEach((card) => {
            card.reset();
        });
    },


    __hideMatchedCards() {
        this._selectedCards.forEach((card) => {
            card.hide();
        });
    },


    __removeSelectedCards() {
        this._selectedCards.length = 0;
    },
});
