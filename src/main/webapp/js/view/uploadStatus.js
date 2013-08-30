define(['jquery', 'underscore', 'backbone', 'pubSubEvents', 'view/modalDialog', 'text!template/uploadStatus.html'],
	function($, _, Backbone, PubSubEvents, ModalDialogView, uploadStatusTemplate) {

		// TODO Remove selected files/cancel upload, drag and drop, hover close icon.
		var uploadStatusView = ModalDialogView.extend({
			initialize: function() {
				_.bindAll(this, 'render');
				PubSubEvents.bind('dropUploadFile', this.uploadFile, this);
				this.template = _.template(uploadStatusTemplate);
			},
			
			events: {
			},
			
			render: function() {
				$(this.el).html(this.template());
				return this;
			},
			
			addFile: function(files) {
				this.files = files;
				this.fileNum = this.files.length;
				for (var i = 0; i < this.files.length; i ++) {
					$('#droppedFiles').append('<tr><td id="fileDrop_' + i + '">' + this.files[i].name + '</td><td>' + this.files[i].size + 
							'</td></tr><tr><td id="progressDrop_' + i + 
							'"><div id="barDrop_' + i + 
							'" class="bar"></div></td><td id="percentDrop_' + i + '"></td></tr>');
				}
				$('#numFileDropped').html(this.files.length);
			},
			
			uploadFile: function() {
				var that = this;

		        var uploadProgress = function(event) {
		        	var name = event.target.myParam;
		        	
		            if (event.lengthComputable) {
		                var percentComplete = Math.round(event.loaded * 100 / event.total);
		                $('#barDrop_' + name).width(percentComplete + '%');
		                $('#percentDrop_' + name).html(percentComplete.toString() + '%');
		                
		            	console.log('uploadProgress: ' + percentComplete.toString() + '%' + ', ' + name);
		            }
		            else {
		            	console.log('uploadProgress unable to compute');
		            }
		        }

		        var uploadComplete = function(event) {
		        	var name = event.target.myParam;

	                $('#barDrop_' + name).width('100%');
	                $('#percentDrop_' + name).html('100%');
	                that.fileNum--;

					console.log('uploadComplete: ' + name + ', ' + that.fileNum);

	                if (that.fileNum == 0) {
	                	console.log('uploadComplete delay: ' + name + ', ' + that.fileNum);
	                	var delay = setTimeout(
	                		function() {
	                			that.hideModal();
	                			PubSubEvents.trigger('refreshRightPane');
	                		},
	                		1000
	                	);
	                }
		        }

		        var uploadFailed = function(event) {
		        	// TODO Error handling.
		            alert("There was an error attempting to upload the file.");
		        }

		        var uploadCanceled = function(event) {
		        	// TODO Cancel handling.
		            alert("The upload has been canceled by the user or the browser dropped the connection.");
		        }
		        
		        $('.bar').show();
				
				for (var i = 0; i < this.files.length; i ++) {
		            var formData = new FormData();
					formData.append('type', 'aws');
					formData.append('storageName', sessionStorage.storageName);
					formData.append('file', this.files[i]);
				    
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
	
		return uploadStatusView;
	}
);
