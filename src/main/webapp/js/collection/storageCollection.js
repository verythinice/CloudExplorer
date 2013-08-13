define(['underscore', 'backbone', 'model/storageModel'],
	function(_, Backbone, StorageModel) {
	
		var storageCollection = Backbone.Collection.extend({
			model: StorageModel,
			
			initialize : function(models, options) {},
			
		    url: 'cloud/storage/list'
		});

		return storageCollection;
	}
);
