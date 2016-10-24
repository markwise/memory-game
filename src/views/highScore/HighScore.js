import Backbone from 'backbone';
import Events from 'scripts/events';
import template from './highScore.njk';

export default Backbone.View.extend({
    className: 'HighScore',

    initialize() {
        this._score = Number(localStorage.getItem('highScore')) || 999;

        this.listenTo(Events, 'UPDATE_HIGHSCORE', (score) => {
            this._score = score;
            this.render();
            localStorage.setItem('highScore', score);
        });
    },

    render() {
        this.el.innerHTML = template.render({
            data: {
                score: this._score
            }
        });

        return this;
    },

    getScore() {
        return this._score;
    }
});
