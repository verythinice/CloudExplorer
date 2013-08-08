define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'model/objectModel', 'collection/objectCollection', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, ObjModel, ObjectCollection, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				this.pubSubEvents = PubSubEvents;
				this.pubSubEvents.bind('updateRender', this.render);
			},

			render: function(name) {
				console.log ('rightPane render: ' + name);
				var that = this;
				
				if (name) {
					sessionStorage.storageName = name;
				}
				else {
					name = sessionStorage.storageName;
				}
				
				var fetchSuccess = function(collection) {
					var data = {
							objs: that.collection.models,
							_: _
					};
					var compiledTemplate = _.template(rightPaneTemplate, data);

					$('#rightPane').html(compiledTemplate); 
			    }
				
				var fetchError = function() {
					console.log('Error!')
				}
				
				this.collection = new ObjectCollection([]);
				var params = {
					type: 'aws',
					name: name
				};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
			},
			
			events: {
				'click': 'selectObject',
			},
			
			selectObject: function(event) {
				$('#' + event.target.id).toggleClass('objectSelected');
			},
		});

		return rightPaneView;
	}
);
