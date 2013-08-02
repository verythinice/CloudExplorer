define(['jquery', 'underscore', 'backbone', 'model/objModel', 'collection/objCollection', 'text!template/rightPane.html'],
	function($, _, Backbone, ObjModel, ObjCollection, rightPaneTemplate) {

		var rightPaneView = Backbone.View.extend({
			initialize: function() {
				if (this.options.storageId == 0) {
					var Obj0 = new ObjModel({name: 'id 0 Obj 0', id: 'id0'});
					var Obj1 = new ObjModel({name: 'id 0 Obj 1', id: 'id1'});
				}
				else if (this.options.storageId == 1) {
					var Obj0 = new ObjModel({name: 'id 1 Obj 2', id: 'id0'});
					var Obj1 = new ObjModel({name: 'id 1 Obj 3', id: 'id1'});
				}
				else if (this.options.storageId == 2) {
					var Obj0 = new ObjModel({name: 'id 2 Obj 4', id: 'id0'});
					var Obj1 = new ObjModel({name: 'id 2 Obj 5', id: 'id1'});
				}
				
				var Objs = [Obj0, Obj1];
				this.collection = new ObjCollection(Objs);  
			},

			render: function() {
				var data = {
						objs: this.collection.models,
						_: _
				};

				var compiledTemplate = _.template(rightPaneTemplate, data);
				this.$el.html(compiledTemplate); 
			}
		});

		return rightPaneView;
	}
);
