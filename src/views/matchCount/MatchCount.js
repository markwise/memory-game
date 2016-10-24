import Backbone from 'backbone';
import Events from 'scripts/events';
import template from './matchCount.njk';

export default Backbone.View.extend({
    className: 'MatchCount',

    initialize() {
        this._count = 0;

        this.listenTo(Events, 'INCREMENT_MATCH_COUNT', () => {
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
    }
});
