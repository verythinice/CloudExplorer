define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				PubSubEvents.bind('refreshRightPane', this.render, this);
				PubSubEvents.bind('copyObject', this.copyObject, this);
				PubSubEvents.bind('pasteObject', this.pasteObject, this);
				PubSubEvents.bind('renameObject', this.renameObjectStart, this);
				PubSubEvents.bind('deleteObject', this.deleteObject, this);
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
			
			copyObject: function() {
				// TODO Multiple select.
				$('.objectSelected').addClass('objectCopied');
				// TODO: Need to remember the source of storage and object.
				sessionStorage.source = sessionStorage.storageName;
			},
			
			pasteObject: function() {
				var name = $('.objectCopied').text();
				var urlStr = 'cloud/object/copy?type=' + localStorage.getItem('storageType') + '&source=' + sessionStorage.source + '&destination=' + sessionStorage.storageName + '&name=' + name + '&newName=' + name;
		    	
		    	console.log('pasteObject: ' + urlStr);
		    	var that = this;

				$.ajax({
                	url: urlStr,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus, xhr) {
						console.log(textStatus);
						that.render();
                    },
                    error: function(xhr, textStatus, errorThrown) {
						console.log(textStatus);
                    }
                });
				
			},
			
			dragStart: function(event) {
				event.originalEvent.dataTransfer.setData('dragObject', event.target.id);
			},
			
			renameObjectStart: function() {
				// TODO Multiple select.
				this.originalName = $('.objectSelected').text();
				$('.objectSelected').html('<input type="text" id="renameObj" name="renameObj" class="renameObj" value="' + this.originalName + '" />').toggleClass('objectSelected');
			},
			
			renameObject: function(event) {
				if (event.keyCode != 13) return;
		    	event.preventDefault();
				var value = $('#' + event.target.id).val();
				var urlStr = 'cloud/object/rename?type=' + localStorage.getItem('storageType') + '&storage=' + sessionStorage.storageName + '&name=' + this.originalName + '&newName=' + value;

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
			
			deleteObject: function() {
				var numObj = $('.objectSelected').length;
				
				if (numObj == 1) {
					var name = $('.objectSelected').text();
					var urlStr = 'cloud/object/delete?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + name;

					$.ajax({
	                	url: urlStr,
	                    type: 'GET',
	                    dataType: 'json',
	                    success: function(data, textStatus, xhr) {
							PubSubEvents.trigger('refreshRightPane');
	                    },
	                    error: function(xhr, textStatus, errorThrown) {
							console.log(textStatus);
	                    }
	                });
				}
				else if (numObj > 1) {
					var names = [];
					var name;
					$('.objectSelected').each(function() {
						name = $(this).text();
						names.push(name);
					});
					
					var jsonObj = {};
					jsonObj.type = localStorage.getItem('storageType');
					jsonObj.storageName = sessionStorage.storageName;
					jsonObj.names = names;

					$.ajax({
	                	url: urlStr,
	                    type: 'POST',
	                    dataType: 'json',
						data: JSON.stringify(jsonObj),
	                    success: function(data, textStatus, xhr) {
							PubSubEvents.trigger('refreshRightPane');
	                    },
	                    error: function(xhr, textStatus, errorThrown) {
							console.log(textStatus);
	                    }
	                });
				}
				else {
					// TODO Handle error.
				}
			},

		});

		return rightPaneView;
	}
);
