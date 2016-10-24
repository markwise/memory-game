import Backbone from 'backbone';
import Events from 'scripts/events';
import CardManager from 'views/cardManager/CardManager';
import GuessCount from 'views/guessCount/GuessCount';
import template from './main.njk';


let cards = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
let cardDeck = cards.concat(cards);


export default Backbone.View.extend({
    className: 'Main',

    initialize() {
        this._cardManager = new CardManager({cardDeck: cardDeck});
        this._guessCount = new GuessCount();
    },

    render() {
        let el = this.el;
        el.innerHTML = template.render();
        el.querySelector('.Main-content').appendChild(this._cardManager.el);
        el.querySelector('.Main-status').appendChild(this._guessCount.render().el);




        Events.trigger('NEW_GAME');
    }
});
