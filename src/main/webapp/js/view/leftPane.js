define(['jquery', 'underscore', 'backbone', 'model/storageModel', 'collection/storageCollection', 'view/rightPane', 'text!template/leftPane.html'],
	function($, _, Backbone, StorageModel, StorageCollection, RightPaneView, leftPaneTemplate) {

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
					  
					var rightPaneView = new RightPaneView({el: $('#rightPane'), storageId: 0});
					rightPaneView.render();
			    }
				
				var fetchError = function() {
					console.log('Error!')
				}
				
				this.collection = new StorageCollection([]);  
		        this.collection.fetch({success: fetchSuccess, error: fetchError});
			},
			
		    events: {
		    	'click li': 'selectStorage'
		    },

		    selectStorage: function(event) {
		    	console.log("click li: ", event.target);
		    	
				var rightPaneView = new RightPaneView({el: $('#rightPane'), storageId: event.target.id});
				rightPaneView.render();
		    }
		});

		return leftPaneView;
	}
);

/*
			initialize: function() {
				var storage0 = new StorageModel({name: 'bstestbucket', id: '0'});
				var storage1 = new StorageModel({name: 'test 1', id: '1'});
				var storage2 = new StorageModel({name: 'test 2', id: '2'});

				var storages = [storage0, storage1, storage2];
				this.collection = new StorageCollection(storages);  
			},
			
			render: function() {
				var data = {
						storages: this.collection.models,
						_: _
				};

				var compiledTemplate = _.template(leftPaneTemplate, data);
				this.$el.html(compiledTemplate); 
				  
				var rightPaneView = new RightPaneView({el: $('#rightPane'), storageId: 0});
				rightPaneView.render();
			},

 */
