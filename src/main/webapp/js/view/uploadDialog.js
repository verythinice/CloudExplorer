define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'view/modalDialog', 'text!template/uploadDialog.html'],
	function($, _, Backbone, PubSubEvents, ModalDialogView, uploadDialogTemplate) {

		// TODO Better dialog, handle multiple files, drag and drop, hover close icon.
		var uploadDialogView = ModalDialogView.extend({
			initialize: function() {
				_.bindAll(this, 'render');
				this.template = _.template(uploadDialogTemplate);
				this.fileList = [];
				this.fileNum = 0;

				// TODO No validation yet
				// Backbone.Validation.bind( this, {valid:this.hideError,
				// invalid:this.showError});
				// TODO Check for duplicate files.
			},
			
			events: {
				'submit form': 'uploadFile',
				'change #fileList': 'selectFile'
			},
			
			render: function() {
				$(this.el).html(this.template());
				return this;
			},
			
			selectFile: function(event) {
				var fileList = document.getElementById('fileList');
				for (var i = 0; i < fileList.files.length; i ++) {
					$('#selectedFiles').append('<tr><td id="file_' + this.fileNum + '">' + fileList.files[i].name + '</td><td>' + fileList.files[i].size + 
							'</td></tr><tr><td id="progress_' + this.fileNum + 
							'"><div id="bar_' + this.fileNum + 
							'" class="bar"></div></td><td id="percent_' + this.fileNum + '"></td></tr>');
					this.fileList.push(fileList.files[i]);
					this.fileNum++;
				}
				$('#numFileSelected').html(this.fileNum);
			},
			
			uploadFile: function(event) {
				var that = this;
				event.preventDefault();

	            // TODO Close dialog, show progress bar.
				
		        var uploadProgress = function(event) {
		        	var name = event.target.myParam;
		        	
		            if (event.lengthComputable) {
		                var percentComplete = Math.round(event.loaded * 100 / event.total);
		                $('#bar_' + name).width(percentComplete + '%');
		                $('#percent_' + name).html(percentComplete.toString() + '%');
		                
		            	console.log('uploadProgress: ' + percentComplete.toString() + '%' + ', ' + name);
		            }
		            else {
		            	console.log('uploadProgress unable to compute');
		            }
		        }

		        var uploadComplete = function(event) {
		        	var name = event.target.myParam;

	                $('#bar_' + name).width('100%');
	                $('#percent_' + name).html('100%');

	                // TODO Need to track all files uploaded.
					//that.hideModal();
					// TODO Need to wait a little before refreshing screen.
					/*
					for (var i = 1; i < 10000; i++) {
						var j = i;
					}
					*/
		        	//PubSubEvents.trigger('refreshRightPane');
		            /* This event is raised when the server send back a response */
		            console.log('uploadComplete: ' + name);
		        }

		        var uploadFailed = function(event) {
		        	// TODO Error handling.
		            alert("There was an error attempting to upload the file.");
		        }

		        var uploadCanceled = function(event) {
		        	// TODO Cancel handling.
		            alert("The upload has been canceled by the user or the browser dropped the connection.");
		        }
		        
		        $('#browseFiles').hide();
		        $('#uploadButton').hide();
		        $('.bar').show();
				
				for (var i = 0; i < this.fileList.length; i ++) {
		            var formData = new FormData();
					formData.append('type', 'aws');
					formData.append('storageName', 'bstestbucket');
					formData.append('file', this.fileList[i]);
				    
		            var xhr = new XMLHttpRequest();
		            xhr.upload.myParam = i;
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
