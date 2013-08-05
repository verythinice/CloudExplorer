define(['jquery', 'underscore', 'backbone', 'model/storageModel'],
	function($, _, Backbone, StorageModel) {
	
		var storageCollection = Backbone.Collection.extend({
			model: StorageModel,
			
			initialize : function(models, options) {},
			
		    url: 'cloud/storage/aws',
		    
		    parse: function(data) {
		    	// Change the array of strings to collection of models since that is what backbone wants. 
		    	var newArray = [];
		    	for (var i = 0; i < data.length; i++) {
			    	var newObj = {};
		    		newObj.name = data[i];
		    		newArray.push(newObj);
		    	}
		    	return newArray;
		    }
		});

		return storageCollection;
	}
);
