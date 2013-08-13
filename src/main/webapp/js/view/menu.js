define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'view/uploadDialog', 'text!template/menu.html'],
	function($, _, Backbone, PubSubEvents, UploadDialogView, menuTemplate) {

		var menuView = Backbone.View.extend({
			el: $('#menu'),
			
			initialize: function() {
			},

			events: {
				'click #menuUpload': 'menuUpload',
				'click #menuDownload': 'menuDownload',
				'click #menuCopy': 'menuCopy',
				'click #menuMove': 'menuMove',
				'click #menuRename': 'menuRename',
				'click #menuDelete': 'menuDelete',
				'click #menuOptions': 'menuOptions',
				'click': 'displayMenuOptions'
			},

			render: function() {
				this.$el.html(menuTemplate);
			},

			menuUpload: function(event) {
				event.stopPropagation();
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			},
			
			menuDownload: function(event) {
				event.stopPropagation();
				console.log('menuView click download');
			},
			
			menuCopy: function(event) {
				event.stopPropagation();
				console.log('menuView click copy');
			},
			
			menuMove: function(event) {
				event.stopPropagation();
				console.log('menuView click move');
			},
			
			menuRename: function(event) {
				event.stopPropagation();
				PubSubEvents.trigger('renameObject');
				console.log('menuView click rename');
			},
			
			menuDelete: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				
				// TODO Delete multiple object.
				var value = $('.objectSelected').text();
				var urlStr = 'cloud/object/delete?type=' + localStorage.getItem('storageType') + '&storageName=' + sessionStorage.storageName + '&name=' + value;

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
				
				console.log('menuView click delete');
			},
			
			menuOptions: function(event) {
				// TODO Better looking menu, hide menu on click else where, right mouse click.
				event.stopPropagation();
				$('.submenu').hide();
				switch (event.target.id) {
					case 'iconOnly':
						$('.menuImg').show();
						$('.menuText').hide();
						break;
					case 'textOnly':
						$('.menuImg').hide();
						$('.menuText').show();
						break;
					default:
						$('.menuImg').show();
						$('.menuText').show();
						break;
				}
				console.log('menuView click menuOptions');
			},
			
			displayMenuOptions: function(event) {
				console.log('menuView click event: ' + event.pageX + ' ' + event.pageY + ' ' + event.which);
				
				var offset = $('#menuOptions').offset();
				console.log('menuView click offset before: ' + offset.top + ' ' + offset.left);
				
				// JQuery has issue setting offset for hidden element.
				// So display it first before setting offset.
				$('#menuOptions').offset({top: -99, left: -99});
				$('#menuOptions').show();
				$('#menuOptions').offset({top: event.pageY, left: event.pageX});
				
				offset = $('#menuOptions').offset();
				console.log('menuView click offset after: ' + offset.top + ' ' + offset.left);
				
			}
		});

		return menuView;
	}
);
