import Backbone from 'backbone';
import Events from 'scripts/events';
import template from './card.njk';


export default Backbone.View.extend({
    className: 'Card',

    events: {
        'click': '__handleSelectedCard',
    },

    initialize(options) {
        this._cardId = options.cardId;
    },

    render() {
        this.el.innerHTML = template.render({
            cardId: this._cardId
        });

        return this;
    },

    getCardId() {
        return this._cardId;
    },

    reset() {
        this.el.classList.remove('Card--selected');
    },

    hide() {
        this.el.classList.add('Card--matched');
    },

    __handleSelectedCard(event) {
        this.el.classList.add('Card--selected');
        Events.trigger('CARD_SELECTED', this);
    },
});
