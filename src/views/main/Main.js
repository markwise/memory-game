import Backbone from 'backbone';
import Events from 'scripts/events';
import CardManager from 'views/cardManager/CardManager';
import GuessCount from 'views/guessCount/GuessCount';
import MatchCount from 'views/matchCount/MatchCount';
import HighScore from  'views/highScore/HighScore';
import template from './main.njk';


let cards = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'];
let cardDeck = cards.concat(cards);


export default Backbone.View.extend({
    className: 'Main',

    initialize() {
        this._cardManager = new CardManager({cardDeck: cardDeck});
        this._guessCount = new GuessCount();
        this._matchCount = new MatchCount();
        this._highScore = new HighScore();

        this.listenTo(Events, 'GAME_OVER', () => {
            let guessCount = this._guessCount.getCount();

            if (guessCount < this._highScore.getScore()) {
                Events.trigger('UPDATE_HIGHSCORE', guessCount);
            }
        });
    },

    render() {
        let el = this.el;
        el.innerHTML = template.render();
        el.querySelector('.Main-content').appendChild(this._cardManager.el);
        let mainStatus = el.querySelector('.Main-status');
        mainStatus.appendChild(this._guessCount.render().el);
        mainStatus.appendChild(this._matchCount.render().el);
        mainStatus.appendChild(this._highScore.render().el);
        Events.trigger('NEW_GAME');
    }
});
