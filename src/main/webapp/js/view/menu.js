define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/menu.html'],
	function($, _, Backbone, PubSubEvents, menuTemplate) {

		var menuView = Backbone.View.extend({
			//el: $('#menu'),
			
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
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuUpload');
			},
			
			menuDownload: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuDownload');
			},
			
			menuCopy: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuCopy');
			},
			
			menuPaste: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuPaste');
			},
			
			menuMove: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuMove');
			},
			
			menuRename: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuRename');
			},
			
			menuDelete: function(event) {
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				PubSubEvents.trigger('menuDelete');
			},
			
			menuOptions: function(event) {
				// TODO Better looking menu, hide menu when click else where, right mouse click.
				event.preventDefault();
				event.stopPropagation();
				$('.submenu').hide();
				switch (event.target.id) {
					case 'iconOnly':
						$('.menuText').hide();
						$('.menuImg').addClass('menuImgSpace').show();
						break;
					case 'textOnly':
						$('.menuImg').hide();
						$('.menuText').addClass('menuTextSpace').show();
						break;
					default:
						$('.menuImg').removeClass('menuImgSpace').show();
						$('.menuText').removeClass('menuTextSpace').show();
						break;
				}
			},
			
			displayMenuOptions: function(event) {
				var offset = $('#menuOptions').offset();
				
				// JQuery has issue setting offset for hidden element.
				// So display it first before setting offset.
				$('#menuOptions').offset({top: -99, left: -99});
				$('#menuOptions').show();
				$('#menuOptions').offset({top: event.pageY, left: event.pageX});
				
				offset = $('#menuOptions').offset();
			}
		});

		return menuView;
	}
);
