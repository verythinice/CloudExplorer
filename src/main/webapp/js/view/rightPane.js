define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'tablesorter', 'view/uploadDialog', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, TableSorter, UploadDialogView, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				PubSubEvents.bind('refreshRightPane', this.render, this);
				PubSubEvents.bind('menuUpload', this.uploadObject, this);
				PubSubEvents.bind('menuDownload', this.downloadObject, this);
				PubSubEvents.bind('menuCopy', this.copyObject, this);
				PubSubEvents.bind('menuPaste', this.pasteObject, this);
				PubSubEvents.bind('menuMove', this.moveObject, this);
				PubSubEvents.bind('menuRename', this.renameObjectStart, this);
				PubSubEvents.bind('menuDelete', this.deleteObject, this);
			},
			
			events: {
				'click .draggableObject': 'selectObject',
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
			        //$('#rightPaneTable').tablesorter({debug: true});
			        $('#rightPaneTable').tablesorter();
			    }
				
				var fetchError = function() {
					// TODO Handle error.
					console.log('rightPaneView fetchError');
				}
				
				// TODO Error check name, i.e. no name.
				var params = {
					type: localStorage.getItem('storageType'),
					storageName : sessionStorage.storageName
				};
		        this.collection.fetch({success: fetchSuccess, error: fetchError, data: $.param(params)});
			},
			
			selectObject: function(event) {
				// TODO Multiple select, ctrl, shift.
				$('#' + event.target.id).toggleClass('objectSelected');
			},
			
			uploadObject: function() {
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			},
			
			downloadObject: function() {
				// TODO Handle multiple select.
				var name = $('.objectSelected').text();
				var urlStr = 'cloud/object/download?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + name;
				$('#downloadFile').attr('href', urlStr);
				$('#downloadFile')[0].click();
			},
			
			copyObject: function() {
				// TODO Handle multiple select.
				sessionStorage.sourceStorage = sessionStorage.storageName;
				sessionStorage.sourceObject = $('.objectSelected').text();
			},
			
			pasteObject: function() {
				var urlStr = 'cloud/object/copy?type=' + localStorage.getItem('storageType') +
									'&source=' + sessionStorage.sourceStorage + '&destination=' + sessionStorage.storageName +
									'&name=' + sessionStorage.sourceObject + '&newName=' + sessionStorage.sourceObject;

				// TODO Use backbone sync?
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
						// TODO Handle error.
						console.log(textStatus);
                    }
                });
			},
			
			moveObject: function() {
				// TODO Move.
			},
			
			dragStart: function(event) {
				event.originalEvent.dataTransfer.setData('dragObject', event.target.id);
			},
			
			renameObjectStart: function() {
				// TODO Handle multiple select.
				this.originalName = $('.objectSelected').text();
				// TODO Unbind click event, improve look.
				$('.objectSelected').html('<input type="text" id="renameObj" name="renameObj" class="renameObj" value="' + this.originalName + '" />').toggleClass('objectSelected');
			},
			
			renameObject: function(event) {
				if (event.keyCode != 13) return;
		    	event.preventDefault();
				var value = $('#' + event.target.id).val();
				var urlStr = 'cloud/object/rename?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + this.originalName + '&newName=' + value;

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
						// TODO Handle error.
						console.log(textStatus);
                    }
                });
			},
			
			deleteObject: function() {
				var numObj = $('.objectSelected').length;

				// TODO Test single and multiple delete.
				// TODO Use backbone sync?
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
							// TODO Handle error.
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
	                	url: 'cloud/object/deleteMultiple',
	                    type: 'POST',
						contentType: 'application/json;charset=utf-8',
						data: JSON.stringify(jsonObj),
	                    dataType: 'json',
	                    success: function(data, textStatus, xhr) {
							PubSubEvents.trigger('refreshRightPane');
	                    },
	                    error: function(xhr, textStatus, errorThrown) {
							// TODO Handle error.
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
