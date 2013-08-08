define(['jquery', 'underscore', 'backbone'],
	function($, _, Backbone) {
		var pubSubEvents = _.extend({}, Backbone.Events);
		return pubSubEvents;
	}
);