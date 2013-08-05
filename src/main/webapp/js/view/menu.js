define(['jquery', 'underscore', 'backbone', 'view/uploadDialog', 'text!template/menu.html'],
	function($, _, Backbone, UploadDialogView, menuTemplate) {

		var menuView = Backbone.View.extend({
			el: $('#menu'),

			render: function() {
				this.$el.html(menuTemplate);
			},

			events: {
				'click #upload': 'upload',
			},

			upload: function(){
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			},
		});

		return menuView;
	}
);
