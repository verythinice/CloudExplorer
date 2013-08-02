define(['jquery', 'underscore', 'backbone', 'view/menu', 'view/content', 'view/uploadDialog'],
	function($, _, Backbone, MenuView, ContentView, UploadDialogView) {
	
		var AppRouter = Backbone.Router.extend({
			routes: {
				// TODO Old code.
				// Define some URL routes
				// 'menu/upload': 'uploadDialog',
				
				// Default route.
				'*action': 'defaultAction'
			}
		});

		var initialize = function() {

			var appRouter = new AppRouter;
	
			/* TODO Old code that shouldn't be in initialize.
			appRouter.on('route:uploadDialog', function() {
				console.log('uploadDialog');
				var uploadDialogView = new UploadDialogView();
				uploadDialogView.render().showModal();
			});
			*/
	
			appRouter.on('route:defaultAction', function(actions) {
				var menuView = new MenuView();
				menuView.render();
				
				var contentView = new ContentView();
				contentView.render();
			});
	
			// Unlike the above, we don't call render on this view as it will handle
			// the render call internally after it loads data. Further more we load it
			// outside of an on-route function to have it loaded no matter which page is
			// loaded initially.
			// var footerView = new FooterView();
	
			Backbone.history.start();
		};
		
		return {
			initialize: initialize
		};
	}
);
