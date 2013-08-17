define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'text!template/middlePane.html'],
	function($, _, Backbone, PubSubEvents, middlePaneTemplate) {

		var middlePaneView = Backbone.View.extend({
			initialize: function() {
				this.resizeX = -99;
				this.windowWidth = $(window).width();
			},
			
		    events: {
		    },
			
			render: function() {
				this.$el.html(middlePaneTemplate);
			},
		});

		return middlePaneView;
	}
);