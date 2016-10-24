import Backbone from 'backbone';
import Events from 'scripts/events';
import template from './matchCount.njk';

const totalMatches = 12;

export default Backbone.View.extend({
    className: 'MatchCount',

    initialize() {
        this._count = 0;

        this.listenTo(Events, 'NEW_GAME', () => {
            this._count = 0;
            this.render();
        });

        this.listenTo(Events, 'INCREMENT_MATCH_COUNT', () => {
            this._count += 1;
            this.render();

            if (this._count === totalMatches) {
                Events.trigger('GAME_OVER');
            }
        });
    },

    render() {
        this.el.innerHTML = template.render({
            data: {
                count: this._count
            }
        });

        return this;
    }
});
