import Backbone from 'backbone';
import Events from 'scripts/events';
import template from './guessCount.njk';

export default Backbone.View.extend({
    className: 'GuessCount',

    initialize() {
        this._count = 0;

        this.listenTo(Events, 'NEW_GAME', () => {
            this._count = 0;
            this.render();
        });

        this.listenTo(Events, 'INCREMENT_GUESS_COUNT', () => {
            this._count += 1;
            this.render();
        });
    },

    render() {
        this.el.innerHTML = template.render({
            data: {
                count: this._count
            }
        });

        return this;
    },

    getCount() {
        return this._count;
    }
});
