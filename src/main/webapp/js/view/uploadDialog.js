define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'view/modalDialog', 'text!template/uploadDialog.html'],
	function($, _, Backbone, PubSubEvents, ModalDialogView, uploadDialogTemplate) {

		// TODO Better dialog, hadnle multiple files, drag and drop.
		var uploadDialogView = ModalDialogView.extend({
			initialize: function() {
				_.bindAll(this, 'render');
				this.pubSubEvents = PubSubEvents;
				this.template = _.template(uploadDialogTemplate);
				this.fileList = [];

				// TODO No validation yet
				// Backbone.Validation.bind( this, {valid:this.hideError,
				// invalid:this.showError});
				// TODO Check for duplicate files.
			},
			
			render: function() {
				$(this.el).html(this.template());
				return this;
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
				var that = this;
				event.preventDefault();

	            // TODO Close dialog, show progress bar.
				
		        var uploadProgress = function(event) {
		        	// TODO Need progress bar.
		            if (event.lengthComputable) {
		                var percentComplete = Math.round(event.loaded * 100 / event.total);
		                //document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
		                //document.getElementById('prog').value = percentComplete;
		            	console.log('uploadProgress: ' + percentComplete.toString() + '%');
		            }
		            else {
		                //document.getElementById('progressNumber').innerHTML = 'unable to compute';
		            	console.log('uploadProgress unable to compute');
		            }
		        }

		        var uploadComplete = function(event) {
		        	// TODO Need to track all files uploaded.
					that.hideModal();
					// TODO Need to wait a little before refreshing screen.
					/*
					for (var i = 1; i < 10000; i++) {
						var j = i;
					}
					*/
		        	that.pubSubEvents.trigger('refreshRightPane');
		            /* This event is raised when the server send back a response */
		            console.log('uploadComplete: ' + event.target.responseText);
		        }

		        var uploadFailed = function(event) {
		        	// TODO Error handling.
		            alert("There was an error attempting to upload the file.");
		        }

		        var uploadCanceled = function(event) {
		        	// TODO Cancel handling.
		            alert("The upload has been canceled by the user or the browser dropped the connection.");
		        }
				
				for (var i = 0; i < this.fileList.length; i ++) {
					var formData = new FormData();
					formData.append('storageService', 'aws');
					formData.append('storageName', 'bstestbucket');
					formData.append('file', this.fileList[i]);
				    
		            var xhr = new XMLHttpRequest();
		            xhr.upload.addEventListener("progress", uploadProgress, false);
		            xhr.upload.addEventListener("load", uploadComplete, false);
		            xhr.addEventListener("error", uploadFailed, false);
		            xhr.addEventListener("abort", uploadCanceled, false);
		            xhr.open("POST", "cloud/object/upload", true);
		            xhr.send(formData);
				}
	        },
		});
	
		return uploadDialogView;
	}
);
