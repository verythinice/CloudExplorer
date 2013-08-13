define(['jquery', 'underscore', 'backbone', 'collection/storageCollection', 'collection/objectCollection', 'view/leftPane', 'view/rightPane', 'text!template/content.html'],
	function($, _, Backbone, StorageCollection, ObjectCollection, LeftPaneView, RightPaneView, contentTemplate) {

		var contentView = Backbone.View.extend({
			el: $('#content'),

		    initialize: function () {
		    	// TODO UI for user to choose.
		    	localStorage.setItem('storageType', 'aws');
		    },
		    
		    events: {
		    },

			render: function() {
				this.$el.html(contentTemplate);
				
				// TODO Store storage type, storage name in local or session storage. 
				this.storageCollection = new StorageCollection([]);
				this.leftPaneView = new LeftPaneView({el: $('#leftPane'), collection: this.storageCollection});
				this.leftPaneView.render();
				
				this.objectCollection = new ObjectCollection([]);
				this.rightPaneView = new RightPaneView({el: $('#rightPane'), collection: this.objectCollection});
			},
		});

		return contentView;
	}
);
