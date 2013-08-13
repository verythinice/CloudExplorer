require.config({
	// Require.js allows us to configure shortcut alias.
	paths: {
		// Libraries.
		//jquery: '../lib/jquery-1.9.1.min',
		jquery: '../lib/jquery-1.9.1',
		underscore: '../lib/underscore-min',
		//backbone: '../lib/backbone-min',
		backbone: '../lib/backbone',

		// Require.js plugin.
		text: '../lib/text',

		// A short cut to put html outside the js dir. This might make it easier for HTML/CSS designers.
		template: '../template'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	},

	urlArgs: "bust=" + (new Date()).getTime()
});

// Start the application.
require(['router'], 
	function(Router) {
		Router.initialize();
	}
);
