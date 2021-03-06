import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';
import $ from 'jquery';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    createLabel: function() {
      var controller = this.controllerFor('profile.labels.new'),
          label = this.store.createRecord('label', controller.get('model')),
          _this = this;

      // label.set('position', this.get('session.currentUser.labels.length') + 1);
      
      label.save().then(function() {
        controller.successfulSave();

        Ember.run.schedule('afterRender', this, function() {
          _this.controller.get('jquiDraggable').contentUpdated();
        });
      },
      function(error) {
        controller.failedSave(error);
      });
    },

    updateLabel: function(options) {
      var label = options.model,
          controller = this.controllerFor('profile.labels.edit');

      label.save().then(function() {
        controller.successfulSave();
      },
      function(error) {
        label.rollbackAttributes();
        controller.failedSave(error);
      });
    },

    removeLabel: function(label) {
      if (window.confirm('Are you sure, you want to delete this label?')) {
        var moveToAllCards = this.controllerFor('profile.labels').get('model.id') === label.id,
            _this = this;

        label.destroyRecord().then(function() {
          if (moveToAllCards) {
            _this.transitionTo('profile');
          }
        });
      }
      // TODO: redirect to profile if we stay on the deleted path
    },

    dropLabelOnCard: function(params) {
      var label = this.store.peekRecord('label', $(params.ui.draggable).data('label-id')),
          card = this.store.peekRecord('card', $(params.event.target).data('card-id')),
          _this = this,
          adapter = this.container.lookup('adapter:application');

      $.ajax({
        method: 'post',
        url: adapter.buildURL() + '/label_cards',
        data: { label_id: label.id, card_id: card.id },
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', 'Token token="' + _this.get('session.content.secure.token') + '"');
        },
      })
      .fail(function() {
        Ember.run(function() {
          label.get('cards').removeObject(card);
          alert('Something went wrong, please try later.');
        });
      });

      label.get('cards').pushObject(card);
    }
  }
});
