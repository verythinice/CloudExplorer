define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'collection/storageCollection', 'collection/objectCollection', 'view/leftPane', 'view/middlePane', 'view/rightPane', 'view/uploadStatus', 'text!template/content.html'],
	function($, _, Backbone, PubSubEvents, StorageCollection, ObjectCollection, LeftPaneView, MiddlePaneView, RightPaneView, UploadStatusView, contentTemplate) {

		var contentView = Backbone.View.extend({
			el: $('#content'),

		    initialize: function () {
		    	// TODO UI for user to choose.
		    	localStorage.setItem('storageType', 'aws');
		    	$(window).on('resize', this.resizeWindow);

		    	/*
		    	window.addEventListener("dragover",function(e){
		    		  e = e || event;
		    		  e.preventDefault();
		    	},false);
		    	window.addEventListener("drop",function(e){
		    		  e = e || event;
		    		  e.preventDefault();
	    		},false);
	    		*/
		    },
		    
		    events: {
		    	'mousedown #middlePane': 'startResizePane',
		    	'dragover .droppableObject': 'dragOver',
		    	'drop .droppableObject': 'drop',
		    	'dragover': 'dropPreventDefault',
		    	'drop': 'dropPreventDefault'
		    },

			render: function() {
				var delay = setTimeout(
                		function() {
            				$('#message').html('<p>Loading ...</p>').show();
                		},
                		1000
                );				

				this.$el.html(contentTemplate);
				this.resizeWindow();
				
				// TODO Should some or all of these be in initialize.
				this.storageCollection = new StorageCollection([]);
				this.leftPaneView = new LeftPaneView({el: $('#leftPane'), collection: this.storageCollection});
				this.leftPaneView.render();

				this.middlePaneView = new MiddlePaneView({el: $('#middlePane')});
				this.middlePaneView.render();
				
				this.objectCollection = new ObjectCollection([]);
				this.rightPaneView = new RightPaneView({el: $('#rightPane'), collection: this.objectCollection});
				
				clearTimeout(delay);
				$('#message').hide();
			},

			startResizePane: function(event) {
				console.log('startResizePane: ' + event.type + ', ' + event.pageX + ', ' + this.resizeX);
				event.preventDefault();
				$(this.$el).on('mousemove', {data: this}, this.resizePane);
				$(this.$el).on('mouseup', {data: this}, this.stopResizePane);
				
				// Remember starting x position.
				this.resizeX = event.pageX;
				// Allow resize for a little bit before checking if the panes are within the allowed percentage.
				// Otherwise once panes are within the limit, can't resize any more.
				this.checkPercent = -5;
		    },

			resizePane: function(event) {
				event.preventDefault();
				var data = event.data.data;
				//console.log('resizePane: ' + event.type + ', ' + event.pageX + ', ' + data.resizeX);
				
				if (data.resizeX > 0) {
					var x = data.resizeX - event.pageX;
					if (x != 0) {
						data.resizeX = event.pageX;
						
						var parentWidth = $('#content').width();
						var leftPaneWidth = $('#leftPane').width();
						var percent = leftPaneWidth / parentWidth * 100;
						//console.log('resizePane: ' + leftPaneWidth + ', ' + parentWidth + ', ' + percent, ', ', data.checkPercent);
						
						if (data.checkPercent < 0 || (percent > 10 && percent < 90)) {
							data.checkPercent++;
							
							leftPaneWidth = leftPaneWidth - x;
							$('#leftPane').width(leftPaneWidth);
							
							$('#middlePane').css({left: leftPaneWidth});
							
							var rightPaneWidth = $('#rightPane').width() + x;
							$('#rightPane').width(rightPaneWidth);
							$('#rightPane').css({left: leftPaneWidth + 6});
							
							//console.log('resizePane: ' + x + ', ' + leftPaneWidth + ', ' + rightPaneWidth);
						}
					}
				}
		    },

		    stopResizePane: function(event) {
				console.log('stopResizePane: ' + event.type + ', ' + event.pageX + ', ' + this.resizeX);
		    	event.preventDefault();
		    	var data = event.data.data;
				$(data.$el).off('mousemove');
				$(data.$el).off('mouseup');
				data.resizeX = -99;
		    },
		    
		    resizeWindow: function() {
		    	var parentWidth = $('#content').width();
		    	var leftPaneWidth = $('#leftPane').width();
		    	var percent = .25;
		    	if (leftPaneWidth > 0) {
		    		percent = leftPaneWidth / parentWidth;
		    	}
		    	//console.log('resizeWindow: ' + parentWidth, ', ' + leftPaneWidth, ', ' + percent);

		    	leftPaneWidth = parentWidth * percent;
				$('#leftPane').width(leftPaneWidth);
				
				$('#middlePane').css({left: leftPaneWidth});
				
				rightPaneWidth = parentWidth - 6 - leftPaneWidth;
				$('#rightPane').width(rightPaneWidth);
				$('#rightPane').css({left: leftPaneWidth + 6});
		    },
		    
		    dragOver: function(event) {
		    	event.preventDefault();
		    },
		    
		    drop: function(event) {
		    	event.preventDefault();

		    	var files = event.originalEvent.dataTransfer.files;
				var uploadStatusView = new UploadStatusView();
				uploadStatusView.render().showModal();
				uploadStatusView.addFile(files);
				// Give time for the dialog to render.
				var delay = setTimeout(
                		function() {
                			PubSubEvents.trigger('dropUploadFile');
                		},
                		1000
                );	

		    	var len = files.length;
			    for (var i = 0; i < len; i++) {
			        console.log("Filename: " + files[i].name);
			        console.log("Type: " + files[i].type);
			        console.log("Size: " + files[i].size + " bytes");
			    }
		    },
		    
		    dropPreventDefault: function(event) {
		    	console.log('dropPreventDefault');
		    	event.preventDefault();
		    },
		});

		return contentView;
	}
);
