define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				PubSubEvents.bind('refreshRightPane', this.render, this);
				PubSubEvents.bind('renameObject', this.renameObjectStart, this);
			},
			
			events: {
				'click': 'selectObject',
				'dragstart .draggableObject': 'dragStart',
				'keypress input[type=text]': 'renameObject',
			},

			render: function() {
				// TODO Loading message.
				
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
			
			selectObject: function(event) {
				// TODO Multiple select.
				$('#' + event.target.id).toggleClass('objectSelected');
			},
			
			dragStart: function(event) {
				console.log('dragStart: ' + event.target.id);
				event.originalEvent.dataTransfer.setData('dragObject', event.target.id);
			},
			
			renameObjectStart: function() {
				console.log('renameObjectStart');
				this.originalName = $('.objectSelected').text();
				$('.objectSelected').html('<input type="text" id="renameObj" name="renameObj" class="renameObj" value="' + this.originalName + '" />').toggleClass('objectSelected');
			},
			
			renameObject: function(event) {
				console.log('renameObject: ' + event.target.id);
				if (event.keyCode != 13) return;
		    	event.preventDefault();
				var value = $('#' + event.target.id).val();
				var urlStr = 'cloud/object/rename?type=' + localStorage.getItem('storageType') + '&storage=' + sessionStorage.storageName + '&name=' + this.originalName + '&newName=' + value;
		    	
		    	console.log('renameObject: ' + urlStr);

				$.ajax({
                	url: urlStr,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus, xhr) {
						console.log(textStatus);
						$('#' + event.target.id).parent().html(value);
						//PubSubEvents.trigger('refreshRightPane');
                    },
                    error: function(xhr, textStatus, errorThrown) {
						console.log(textStatus);
                    }
                });
				
			},
		});

		return rightPaneView;
	}
);
