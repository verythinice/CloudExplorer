define(['jquery', 'underscore', 'backbone', 'mediator', 'view/modalDialog', 'text!template/uploadDialog.html'],
	function($, _, Backbone, Mediator, ModalDialogView, uploadDialogTemplate) {

		// TODO Better dialog, hadnle multiple files, drag and drop.
		var uploadDialogView = ModalDialogView.extend({
			initialize: function() {
				_.bindAll(this, 'render');
				this.template = _.template(uploadDialogTemplate);
				this.fileList = [];
				// TODO No validation yet
				// Backbone.Validation.bind( this, {valid:this.hideError,
				// invalid:this.showError});
				// TODO Check for duplicate files.
			},
			
			events: {
				'submit form': 'uploadFile',
				'change #fileList': 'selectFile'
			},
			
			selectFile: function(event) {
				var fileList = document.getElementById('fileList');
				for (var i = 0; i < fileList.files.length; i ++) {
					$('#selectedFiles').append('<tr><td>' + fileList.files[i].name + '</td><td>' + fileList.files[i].size + '</td><td></td></tr><tr><td colspan="3"></td></tr>');
					this.fileList.push(fileList.files[i]);
				}
			},
			
			uploadFile: function(event) {
				event.preventDefault();
				
				var formData = new FormData();
				formData.append('storageService', 'aws');
				formData.append('storageName', 'bstestbucket');
				
				for (var i = 0; i < this.fileList.length; i ++) {
					formData.append('file', this.fileList[i]);
				    
		            var xhr = new XMLHttpRequest();
		            xhr.upload.addEventListener("progress", this.uploadProgress, false);
		            xhr.upload.addEventListener("load", this.uploadComplete, false);
		            xhr.addEventListener("error", this.uploadFailed, false);
		            xhr.addEventListener("abort", this.uploadCanceled, false);
		            xhr.open("POST", "cloud/object/upload", true);
		            xhr.send(formData);
				}
	            
	            // TODO Close dialog, show progress bar.
				this.hideModal();
				
				Backbone.Mediator.publish('update');
	        },

	        uploadProgress: function(evt) {
	        	// TODO Need progress bar.
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
	            alert('uploadComplete: ' + evt.target.responseText);
	        },

	        uploadFailed: function(evt) {
	        	// TODO Error handling.
	            alert("There was an error attempting to upload the file.");
	        },

	        uploadCanceled: function(evt) {
	        	// TODO Cancel handling.
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
