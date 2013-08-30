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
				
				this.renameObj = false;
			},
			
			events: {
				'click tr': 'selectObject',
				'mouseover tr': 'startHoverObject',
				'mouseout tr': 'stopHoverObject',
				'dragstart .draggableObject': 'dragStart',
		    	'dragend .draggableObject': 'dragstop',
				'keypress input[type=text]': 'renameObject',
				'mousedown': 'mousedown',
			},

			render: function() {
				var delay = setTimeout(
                		function() {
            				$('#message:hidden').html('<p>Refreshing ...</p>').show();
                		},
                		1000
                );				
				
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

					clearTimeout(delay);
					$('#message').hide();
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
			
			mousedown: function(event) {
				// Prevent default selection for shift and control.
				if (event.shiftKey == 1 || event.ctrlKey==1) {
					return false;
				}
			},
			
			selectObject: function(event) {
				if (this.renameObj) {
					return;
				}
				
		    	event.preventDefault();
		    	event.stopPropagation();
		    	
				if (event.shiftKey == 1) {
					var test = $('#rightPaneTable .objectSelected');
					if (!$('#rightPaneTable .objectSelected').length) {
						$('#' + event.target.id).parents('tr').removeClass('objectHover').addClass('objectSelected');
						return;
					}
					
					var startSelection = false, stopSelection = false, clearSelection = false;;
					var id = $('#' + event.target.id).parents('tr').attr('id');
					
					$('#rightPaneTable tbody tr').each(function() {
						if (clearSelection) {
							$(this).removeClass('objectSelected');
							return;
						}
						
						if ($(this).hasClass('objectSelected')) {
							if (stopSelection) {
								clearSelection = true;
							}
							else if (!startSelection) {
								startSelection = true;
							}
						}
						
						if ($(this).attr('id') == id) {
							if (startSelection) {
								$(this).removeClass('objectHover').addClass('objectSelected');
								clearSelection = true;
							}
							else {
								startSelection = true;
								stopSelection = true;
							}
						}
						
						if (startSelection) {
							$(this).removeClass('objectHover').addClass('objectSelected');
						}
					});
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
				$selected = $('#rightPaneTable .objectSelected');
				if ($selected.length == 0) {
					$('#message').html('<p>Select a file to download.</p>').show();
					var delay = setTimeout(
	                		function() {
	            				$('#message').hide();
	                		},
	                		3000
	                );				
					return;
				}
				
				// TODO Handle multiple select.
				var name = $selected.find('span').text();
				var urlStr = 'cloud/object/download?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + name;
				$('#downloadFile').attr('href', urlStr);
				$('#downloadFile')[0].click();
			},
			
			copyObject: function() {
				// TODO Handle multiple select, no select.
				sessionStorage.sourceStorage = sessionStorage.storageName;
				sessionStorage.sourceObject = $('#rightPaneTable .objectSelected').find('span').text();
				
				$('#message').html('<p>' + sessionStorage.sourceObject + ' copied </p>').show();
				var delay = setTimeout(
                		function() {
            				$('#message').hide();
                		},
                		3000
                );				
			},
			
			pasteObject: function() {
				// TODO Handle no copy.
				$('#message').html('<p>Pasting ...</p>').show();				
				
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
				// TODO Move dialog.
				$('#message').html('<p>Select file(s), drag the file(s) and drop it into the destination bucket</p>').show();
				var delay = setTimeout(
                		function() {
            				$('#message').hide();
                		},
                		3000
                );				
			},
			
			dragStart: function(event) {
				console.log('dragStart: ' + event.target.id);
				$('#rightPane').removeClass('droppableObject');
				event.originalEvent.dataTransfer.setData('dragObject', event.target.id);
				
				var $target = $('#' + event.target.id);
				if (!$target.is('tr')) {
					$target = $('#' + event.target.id).parents('tr');
				}
				
				
				if (!$target.hasClass('objectSelected')) {
					console.log('dragStart: no selection');
					$('#rightPaneTable .objectSelected').removeClass('objectSelected');
					$target.removeClass('objectHover').addClass('objectSelected');
				}
			},
		    
		    dragstop: function(event) {
		    	console.log('dragstop');
		    	$('#rightPane').addClass('droppableObject');
		    },
			
			renameObjectStart: function() {
				this.renameObj = true;
				// TODO Handle multiple select, no select.
				this.originalName = $('#rightPaneTable .objectSelected').find('span').text();
				console.log('renameObjectStart: ' + this.originalName);
				// TODO Improve look.
				$('#rightPaneTable .objectSelected').find('span').hide();
				$('#rightPaneTable .objectSelected').find('input').val(this.originalName).show().focus();
			},
			
			renameObject: function(event) {
				console.log('renameObject');
		    	event.stopPropagation();
				if (event.keyCode != 13) return;
				this.renameObj = false;
				var value = $('#' + event.target.id).val();
				if (this.originalName == value) {
					$('#' + event.target.id).hide().prev().show();
					return;
				}
				var urlStr = 'cloud/object/rename?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + this.originalName + '&newName=' + value;

				$.ajax({
                	url: urlStr,
                    type: 'GET',
                    dataType: 'json',
                    success: function(data, textStatus, xhr) {
						console.log(textStatus);
						PubSubEvents.trigger('refreshRightPane');
                    },
                    error: function(xhr, textStatus, errorThrown) {
						// TODO Handle error.
						console.log(textStatus);
                    }
                });
			},
			
			deleteObject: function() {
				var numObj = $('#rightPaneTable .objectSelected').length;

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
