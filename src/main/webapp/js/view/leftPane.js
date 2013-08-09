define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/leftPane.html'],
	function($, _, Backbone, PubSubEvents, leftPaneTemplate) {

		var leftPaneView = Backbone.View.extend({
			initialize: function() {
			},
			
			render: function() {
				var that = this;
				
				var fetchSuccess = function(collection) {
					var data = {
							storages: that.collection.models,
							_: _
					};
					var compiledTemplate = _.template(leftPaneTemplate, data);

					that.$el.html(compiledTemplate);
					
					// Don't render the right pane until the left pane is done.
					var model = that.collection.at(0);
					if (model) {
						sessionStorage.storageName = model.get('name');;
					}
					PubSubEvents.trigger('refreshRightPane');
			    }
				
				var fetchError = function() {
					console.log('leftPaneView fetchError');
				}
				
				var params = {
						type: localStorage.getItem('storageType')
					};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
			},
			
		    events: {
		    	'click li': 'selectStorage'
		    },

		    selectStorage: function(event) {
		    	// TODO Highlight current storage.
		    	sessionStorage.storageName = event.target.id;
		    	PubSubEvents.trigger('refreshRightPane');
		    }
		});

		return leftPaneView;
	}
);