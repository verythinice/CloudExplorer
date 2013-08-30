define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/leftPane.html'],
	function($, _, Backbone, PubSubEvents, leftPaneTemplate) {

		var leftPaneView = Backbone.View.extend({
			initialize: function() {
			},
			
		    events: {
		    	'click .droppableStorage': 'selectStorage',
		    	'dragover .droppableStorage': 'dragOver',
		    	'drop .droppableStorage': 'drop',
				'mousemove tr': 'startHoverStorage',
				'mouseout tr': 'stopHoverStorage',
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
						sessionStorage.storageName = model.get('name');
						$('#' + sessionStorage.storageName).parents('tr').addClass('objectSelected').removeClass('droppableStorage');
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
		    	$('#leftPaneTable .objectSelected').addClass('droppableStorage').removeClass('objectSelected');
				$('#' + event.target.id).parents('tr').addClass('objectSelected').removeClass('droppableStorage');
				if ($('#' + event.target.id).is('td')) {
					sessionStorage.storageName = $('#' + event.target.id).children().attr('id');
				}
				else {
			    	sessionStorage.storageName = event.target.id;
				}
		    	PubSubEvents.trigger('refreshRightPane');
		    },
		    
		    dragOver: function(event) {
		    	event.preventDefault();
		    },
		    
		    drop: function(event) {
		    	console.log('drop');
		    	$('#message').html('<p>Moving ...</p>').show();
		    	event.preventDefault();

		    	// OLD Single select, keep for reference for now.
		    	/*
		    	var data = event.originalEvent.dataTransfer.getData('dragObject');
				var value = $('#' + data).text();
				*/
				
				var destination = event.target.id;
				if ($('#' + event.target.id).is('td')) {
					destination = $('#' + event.target.id).children().attr('id');
				}
				
				var $selected = $('#rightPaneTable .objectSelected');
				var num = $selected.length;
				
				$selected.each(function() {
					var value = $(this).find('span').text();
					var urlStr = 'cloud/object/move?type=' + localStorage.getItem('storageType') + '&source=' + sessionStorage.storageName + '&destination=' + destination + '&name=' + value;
					console.log('drop: ' + value);

					$.ajax({
	                	url: urlStr,
	                    type: 'GET',
	                    dataType: 'json',
	                    success: function(data, textStatus, xhr) {
							num--;
							if (num == 0) {
								PubSubEvents.trigger('refreshRightPane');
							}
	                    },
	                    error: function(xhr, textStatus, errorThrown) {
							// TODO Handle error.
							console.log(textStatus);
	                    }
	                });
				});
		    },
		    
		    startHoverStorage: function(event) {
		    	event.preventDefault();
		    	event.stopPropagation();

		    	clearTimeout(this.timerId);
		    	
			    var displayTooltip = function() {
			    	var left = event.pageX + 5;
			    	
					// JQuery has issue setting offset for hidden element. So display it first before setting offset.
			    	if ($('#' + event.target.id).is('span')) {
				    	$('#' + event.target.id).next().offset({top: -99, left: -99}).show().offset({top: event.pageY, left: left});
			    	}
			    	else {
				    	$('#' + event.target.id).find('div').offset({top: -99, left: -99}).show().offset({top: event.pageY, left: left});
			    	}
			    }
			    
		    	this.timerId = setTimeout(displayTooltip, 500)
			},
		    
		    stopHoverStorage: function(event) {
		    	event.preventDefault();
		    	event.stopPropagation();
		    	clearTimeout(this.timerId);
		    	if ($('#' + event.target.id).is('span')) {
			    	$('#' + event.target.id).next().hide();
		    	}
		    	else {
			    	$('#' + event.target.id).find('div').hide();
		    	}
		    },
		});

		return leftPaneView;
	}
);