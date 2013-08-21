define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/leftPane.html'],
	function($, _, Backbone, PubSubEvents, leftPaneTemplate) {

		var leftPaneView = Backbone.View.extend({
			initialize: function() {
			},
			
		    events: {
		    	'click .droppableStorage': 'selectStorage',
		    	'dragover .droppableStorage': 'dragOver',
		    	'drop .droppableStorage': 'drop',
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
					//$('#leftPaneTable').tablesorter({debug: true});
					$('#leftPaneTable').tablesorter();
					
					// Don't render the right pane until the left pane is done.
					var model = that.collection.at(0);
					if (model) {
						// TODO Make el not droppable.
						sessionStorage.storageName = model.get('name');;
					}
					PubSubEvents.trigger('refreshRightPane');
			    }
				
				var fetchError = function() {
					// TODO Handle error.
					console.log('leftPaneView fetchError');
				}
				
				var params = {
						type: localStorage.getItem('storageType')
					};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
			},

		    selectStorage: function(event) {
		    	// TODO Highlight current storage.
		    	// TODO Make el not droppable.
		    	sessionStorage.storageName = event.target.id;
		    	PubSubEvents.trigger('refreshRightPane');
		    },
		    
		    dragOver: function(event) {
		    	event.preventDefault();
		    },
		    
		    drop: function(event) {
		    	event.preventDefault();

		    	// TODO Multiple select.
		    	var data = event.originalEvent.dataTransfer.getData('dragObject');
				var value = $('#' + data).text();
				var urlStr = 'cloud/object/move?type=' + localStorage.getItem('storageType') + '&source=' + sessionStorage.storageName + '&destination=' + event.target.id + '&name=' + value;

				$.ajax({
                	url: urlStr,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus, xhr) {
						PubSubEvents.trigger('refreshRightPane');
                    },
                    error: function(xhr, textStatus, errorThrown) {
						// TODO Handle error.
						console.log(textStatus);
                    }
                });
		    },
		});

		return leftPaneView;
	}
);