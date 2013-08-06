define(['jquery', 'underscore', 'backbone', 'model/objectModel', 'collection/objectCollection', 'text!template/rightPane.html'],
	function($, _, Backbone, ObjModel, ObjectCollection, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
			},

			render: function(name) {
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
					console.log('Error!')
				}
				
				this.collection = new ObjectCollection([]);
				var params = {
					type: 'aws',
					name: name
				};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
		        //this.collection.fetch({success: fetchSuccess, error: fetchError});
			}
		});

		return rightPaneView;
	}
);
