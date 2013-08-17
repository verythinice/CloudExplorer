define(['jquery', 'underscore', 'backbone', 'collection/storageCollection', 'collection/objectCollection', 'view/leftPane', 'view/middlePane', 'view/rightPane', 'text!template/content.html'],
	function($, _, Backbone, StorageCollection, ObjectCollection, LeftPaneView, MiddlePaneView, RightPaneView, contentTemplate) {

		var contentView = Backbone.View.extend({
			el: $('#content'),

		    initialize: function () {
		    	// TODO UI for user to choose.
		    	localStorage.setItem('storageType', 'aws');
		    },
		    
		    events: {
		    	'mousedown #middlePane': 'startResizePane',
		    	//'mousemove': 'resizePane',
		    	'mouseup': 'stopResizePane',
		    },

			render: function() {
				this.$el.html(contentTemplate);
				
				// TODO Should some or all of these be in initialize.
				this.storageCollection = new StorageCollection([]);
				this.leftPaneView = new LeftPaneView({el: $('#leftPane'), collection: this.storageCollection});
				this.leftPaneView.render();

				this.middlePaneView = new MiddlePaneView({el: $('#middlePane')});
				this.middlePaneView.render();
				
				this.objectCollection = new ObjectCollection([]);
				this.rightPaneView = new RightPaneView({el: $('#rightPane'), collection: this.objectCollection});
			},

			startResizePane: function(event) {
				event.preventDefault();
				console.log('startResizePane: ' + event.type + ', ' + event.pageX + ', ' + this.resizeX);
				//$(this.el).delegate('#middlePane', 'mousemove', this.resizePane);
				$(this.$el).on("mousemove", {data: this}, this.resizePane);
				this.resizeX = event.pageX;
				this.windowWidth = $(window).width();
		    },

			resizePane: function(event) {
				data = event.data.data;
				event.preventDefault();
				console.log('resizePane: ' + event.type + ', ' + event.pageX + ', ' + data.resizeX);
				if (data.resizeX > 0) {
					x = data.resizeX - event.pageX;
					if (x != 0) {
						data.resizeX = event.pageX;
						leftPaneWidth = $('#leftPane').width();
						$('#leftPane').width(leftPaneWidth - x);
						rightPaneWidth = $('#rightPane').width();
						$('#rightPane').width(rightPaneWidth + x);
						console.log('resizePane: ' + x + ', ' + leftPaneWidth + ', ' + rightPaneWidth);
					}
				}
				/*
		        ui.element.css({
		            width: ui.element.width()/parent.width()*100+"%",
		            height: ui.element.height()/parent.height()*100+"%"
		        });
		        */				
		    },

		    stopResizePane: function(event) {
		    	event.preventDefault();
				console.log('stopResizePane: ' + event.type + ', ' + event.pageX + ', ' + this.resizeX);
				//$(this.el).undelegate('#middlePane', 'mousemove');
				$(this.$el).off("mousemove");
				this.resizeX = -99;
		    },
			
		});

		return contentView;
	}
);
