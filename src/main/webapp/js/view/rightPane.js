define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'tablesorter', 'view/menu', 'view/uploadDialog', 'text!template/rightPane.html'],
	function($, _, Backbone, PubSubEvents, TableSorter, MenuView, UploadDialogView, rightPaneTemplate) {

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
				'click tr': 'selectObject',
				'mouseover tr': 'startHoverObject',
				'mouseout tr': 'stopHoverObject',
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

			        var menuView = new MenuView({el: $('#menu')});
					menuView.render();
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
		    	event.preventDefault();
		    	event.stopPropagation();
		    	
				// TODO Multiple select, ctrl, shift.
				if (event.shiftKey == 1) {
				}
				else if (event.ctrlKey==1) {
			    	if ($('#' + event.target.id).parents('tr').hasClass('objectSelected')) {
			    		$('#' + event.target.id).parents('tr').removeClass('objectSelected').addClass('objectHover');
			    	}
			    	else {
			    		$('#' + event.target.id).parents('tr').removeClass('objectHover').addClass('objectSelected');
			    	}
				}
				else {
					$('#rightPaneTable .objectSelected').removeClass('objectSelected');
					$('#' + event.target.id).parents('tr').removeClass('objectHover').addClass('objectSelected');
				}
			},
			
			startHoverObject: function(event) {
		    	event.preventDefault();
		    	event.stopPropagation();
		    	if (!$('#' + event.target.id).parents('tr').hasClass('objectSelected')) {
					$('#' + event.target.id).parents('tr').addClass('objectHover');
		    	}
			},
			
			stopHoverObject: function(event) {
		    	event.preventDefault();
		    	event.stopPropagation();
				$('#' + event.target.id).parents('tr').removeClass('objectHover');
			},
			
			uploadObject: function() {
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			},
			
			downloadObject: function() {
				// TODO Handle multiple select.
				var name = $('#rightPaneTable .objectSelected').find('span').text();
				var urlStr = 'cloud/object/download?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + name;
				$('#downloadFile').attr('href', urlStr);
				$('#downloadFile')[0].click();
			},
			
			copyObject: function() {
				// TODO Handle multiple select.
				sessionStorage.sourceStorage = sessionStorage.storageName;
				sessionStorage.sourceObject = $('#rightPaneTable .objectSelected').find('span').text();
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
				this.originalName = $('#rightPaneTable .objectSelected').find('span').text();
				console.log('renameObjectStart: ' + this.originalName);
				// TODO Unbind click event, improve look.
				$('#rightPaneTable .objectSelected').find('span').html('<input type="text" id="renameObj" name="renameObj" class="renameObj" value="' + this.originalName + '" />').toggleClass('objectSelected');
			},
			
			renameObject: function(event) {
		    	event.stopPropagation();
				if (event.keyCode != 13) return;
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
				var numObj = $('#rightPaneTable .objectSelected').length;

				// TODO Test single and multiple delete.
				// TODO Use backbone sync?
				if (numObj == 1) {
					var name = $('#rightPaneTable .objectSelected').find('span').text();
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
					$('#rightPaneTable .objectSelected').each(function() {
						name = $(this).find('span').text();
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
