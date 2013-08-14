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
				'click #menuPaste': 'menuPaste',
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
				$('.submenu').hide();
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			},
			
			menuDownload: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('downloadObject');
			},
			
			menuCopy: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('copyObject');
			},
			
			menuPaste: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('pasteObject');
			},
			
			menuMove: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
			},
			
			menuRename: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('renameObject');
			},
			
			menuDelete: function(event) {
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('deleteObject');
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
