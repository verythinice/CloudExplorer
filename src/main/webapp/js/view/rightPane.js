define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				PubSubEvents.bind('refreshRightPane', this.render, this);
			},

			render: function() {
				// TODO Loading message.
				console.log('rightPaneView: ' + sessionStorage.storageName);
				
				var that = this;
				
				var fetchSuccess = function(collection) {
					var data = {
							objs: that.collection.models,
							_: _
					};
					var compiledTemplate = _.template(rightPaneTemplate, data);

					that.$el.html(compiledTemplate); 
			    }
				
				var fetchError = function() {
					console.log('rightPaneView fetchError');
				}
				
				// TODO Error check name, i.e. no name.
				var params = {
					type: localStorage.getItem('storageType'),
					name: sessionStorage.storageName
				};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
			},
			
			events: {
				'click': 'selectObject',
			},
			
			selectObject: function(event) {
				// TODO Multiple select.
				$('#' + event.target.id).toggleClass('objectSelected');
			},
		});

		return rightPaneView;
	}
);
