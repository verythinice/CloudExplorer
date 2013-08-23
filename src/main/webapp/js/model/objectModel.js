define(['underscore', 'backbone'],
	function(_, Backbone) {

		var objModel = Backbone.Model.extend({
			getDate: function(attr) {
				var date = new Date(this.attributes[attr]);
				return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '&nbsp;&nbsp;' + date.toLocaleTimeString();
			}
		});
	
		return objModel;
	}
);
