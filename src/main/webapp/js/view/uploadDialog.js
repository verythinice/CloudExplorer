define(['jquery', 'underscore', 'backbone', 'view/modalDialog', 'text!template/uploadDialog.html'],
	function($, _, Backbone, ModalDialogView, uploadDialogTemplate) {

		var uploadDialogView = ModalDialogView.extend({
			initialize: function() {
				_.bindAll(this, 'render');
				this.template = _.template(uploadDialogTemplate);
				// TODO No validation yet
				// Backbone.Validation.bind( this, {valid:this.hideError,
				// invalid:this.showError});
			},
			
			events: {
				'submit form': 'uploadFile',
			},
			
			uploadFile: function(event) {
				event && event.preventDefault();
				
				var form = document.getElementById('uploadForm');
			    var action = form.getAttribute('action');
			    var fd = new FormData(form);
			    
			    /*
	            var fd = new FormData();
	            fd.append('fileName', $('#fileName').get(0).files[0]);
	            */
			    
	            var xhr = new XMLHttpRequest();
	            xhr.upload.addEventListener("progress", this.uploadProgress, false);
	            xhr.upload.addEventListener("load", this.uploadComplete, false);
	            //xhr.addEventListener("error", this.uploadFailed, false);
	            //xhr.addEventListener("abort", this.uploadCanceled, false);
	            xhr.open("POST", "cloud/file/upload", true);
	            xhr.send(fd);
	        },

	        uploadProgress: function(evt) {
	            if (evt.lengthComputable) {
	                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	                //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
	                //document.getElementById('prog').value = percentComplete;
	            	console.log(percentComplete.toString() + '%');
	            }
	            else {
	                //document.getElementById('progressNumber').innerHTML = 'unable to compute';
	            	console.log('unable to compute');
	            }
	        },

	        uploadComplete: function(evt) {
	            /* This event is raised when the server send back a response */
	            alert(evt.target.responseText);
	        },

	        uploadFailed: function(evt) {
	            alert("There was an error attempting to upload the file.");
	        },

	        uploadCanceled: function(evt) {
	            alert("The upload has been canceled by the user or the browser dropped the connection.");
	        },
	
			render: function() {
				$(this.el).html(this.template());
				return this;
			}
		});
	
		return uploadDialogView;
	}
);
