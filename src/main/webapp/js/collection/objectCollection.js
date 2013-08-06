define(['underscore', 'backbone', 'model/objectModel'],
	function(_, Backbone, ObjectModel) {

		var objectCollection = Backbone.Collection.extend({
			model: ObjectModel,

			initialize: function(models, options) {
			},

			url: function() {
				return 'cloud/object/list';
			}, 
				
		    parse: function(data) {
		    	var newArray = data.objectSummaries;
		    	return newArray;

		    	/*
		    	// Change the array of strings to collection of models since that is what backbone wants. 
		    	var newArray = [];
		    	for (var i = 0; i < data.length; i++) {
			    	var newObj = {};
		    		newObj.name = data[i];
		    		newArray.push(newObj);
		    	}
		    	return newArray;
		    	*/
		    }
		});

		return objectCollection;
	}
);