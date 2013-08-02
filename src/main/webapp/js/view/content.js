define(['jquery', 'underscore', 'backbone', 'view/leftPane', 'text!template/content.html'],
	function($, _, Backbone, LeftPaneView, contentTemplate) {

		var contentView = Backbone.View.extend({
			el: $('#content'),

		    initialize: function () {
		    },

			render: function() {
				this.$el.html(contentTemplate);
				
				var leftPaneView = new LeftPaneView({el: $('#leftPane')});
				leftPaneView.render();
			}
		});

		return contentView;
	}
);
