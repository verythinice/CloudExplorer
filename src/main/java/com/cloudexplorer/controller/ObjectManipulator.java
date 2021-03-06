/**
 * The factory class that handles objects within the storage.
 * Each public method responds to an http request, calls the class to choose the correct storage type, then calls the class for that storage type. 
 */
package com.cloudexplorer.controller;

import java.io.File;
import java.io.InputStream;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.CloudServiceFactory;
import com.cloudexplorer.util.MultipleDeleteInput;
import com.cloudexplorer.util.Status;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/object")
@Produces(MediaType.APPLICATION_JSON)
public class ObjectManipulator {
	private CloudService service = null;
	/**
	 * Lists the objects in storage. Called with an HTTP GET at /object/list.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param storageName The name of the storage to list the files from
	 * @param marker Optional. The marker for where the list of objects starts
	 * @return a JSON object of S3Object, which has object name, size, owner, etc. for each object
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/list")
	public String listObjects(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("marker") String marker) { 
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if (output==null){
			output = service.listObjects(storageName, marker);
		}
		return output;
	}
	
	/*
	/**
	 * Returns the next list of objects
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @return a JSON object of S3Object, which has object name, size, owner, etc. for each object
	 * Forward slash here
	@GET
	@Path("/next")
	public String nextList(@QueryParam("type") String storageService){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if (output == null){
			output = service.listNext();
		}
		return output;
	}
	
	/**
	 * Returns the previous list of objects
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @return a JSON object of S3Object, which has object name, size, owner, etc. for each object
	 * Forward slash here
	@GET
	@Path("/previous")
	public String previousList(@QueryParam("type") String storageService){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if (output == null){
			output = service.listPrevious();
		}
		return output;
	}
	*/
	
	/**
	 * Copies objects. can copy objects between storage, or into the same storage.
	 * Called with an HTTP GET at /object/copy.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param source The source storage
	 * @param destination The destination storage
	 * @param name The name of the object to be copied
	 * @param newName The new name the object is being copied to. Can be the same as name.
	 * If the name already exists in that storage, it automatically renames the object.
	 * @return A JSON object of a Status indicating success
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/copy")
	public String copyObject(
			@QueryParam("type") String storageService, 
			@QueryParam("source") String source,
			@QueryParam("destination") String destination,
			@QueryParam("name") String name,
			@QueryParam("newName") String newName){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if(output==null){
			output = service.copyObject(source, destination, name, newName);
		}
		return output;
	}
	
	/**
	 * Deletes objects. Called with an HTTP GET at /object/delete.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param storageName The name of the storage the object to be deleted is in
	 * @param name The name of the object to be deleted
	 * @return A JSON object of a Status indicating success
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/delete")
	public String deleteObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String fileName){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if(output==null){
			output = service.deleteObject(storageName, fileName);
		}
		return output;
	}
	
	/**
	 * Deletes multiple objects at once. The objects all need to be in the same bucket.
	 * Called with an HTTP GET at /object/deleteMultiple
	 * @param in A MultipleDeleteInput which contains the parameters for multiple deletes
	 * @return A JSON status message indicating success.
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@POST
	@Path("/deleteMultiple")
	@Consumes(MediaType.APPLICATION_JSON)
	public String deleteMultipleObjects(MultipleDeleteInput in){
		service = CloudServiceFactory.checkStorage(in.getType(), service);
		String output = checkService(service);
		if(output==null){
			output = service.deleteMultipleObjects(in.getStorageName(), in.getNames());
		}
		return output;
	}
	
	/**
	 * Uploads an object to the specified storage.
	 * Called with an HTTP POST at /object/upload.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param storageName The storage to upload the object to
	 * @param file The object to upload
	 * @return A JSON object of a Status indicating success
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadObject(
			@FormDataParam("type") String storageService,
			@FormDataParam("storageName") String storageName,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {
		String name = fileDetail.getFileName();
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if(output==null){
			output = service.uploadObject(storageName, name, uploadedInputStream);
		}
		return output;
	}
	
	/**
	 * Downloads an object from a Cloud Storage. Called with an HTTP GET at /object/download.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param storageName The name of the storage to download the object from
	 * @param name The name of the object to download
	 * @return A response containing the object to download
	 * On failure, returns a response containing a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/download")
	public Response downloadObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String name){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		File file = null;
		if(output==null){
			file = service.downloadObject(storageName, name);
		}
		else{
			ResponseBuilder response = Response.status(404).entity(output);
			return response.build();
		}
		if (file == null){
			Status status = new Status(0, "The server encountered an error, and was unable to fulfill the request");
			ResponseBuilder response = Response.status(500).entity(status.toString());
			return response.build();
		}
		else{
			ResponseBuilder response = Response.ok((Object) file);
			response.header("Content-Disposition",
					"attachment; filename="+name);
			return response.build();
		}
	}
	
	/**
	 * Moves an object from one storage to another
	 * Called with an HTTP GET at /object/move.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param source The source storage for the object to be moved
	 * @param destination The destination storage for the object to be moved to
	 * @param name The name of the object to be moved
	 * @return A JSON object of a Status indicating success
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/move")
	public String moveObject(
			@QueryParam("type") String storageService, 
			@QueryParam("source") String source,
			@QueryParam("destination") String destination,
			@QueryParam("name") String name){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if(output==null){
			output = service.moveObject(source, destination, name, name);
		}
		return output;
	}
	
	/**
	 * Renames an object. Called with an HTTP GET at /object/rename.
	 * @param type The type of cloud storage. Currently only supports AWS
	 * @param storageName The name of the storage holding the object to be renamed
	 * @param name The original name of the object to be renamed
	 * @param newName The new name for the object
	 * @return A JSON object of a Status indicating success
	 * On failure, returns a JSON object of a Status with status 0 and the error message.
	 */
	@GET
	@Path("/rename")
	public String renameObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String name,
			@QueryParam("newName") String newName){
		service = CloudServiceFactory.checkStorage(storageService, service);
		String output = checkService(service);
		if(output==null){
			output = service.renameObject(storageName, name, newName);
		}
		return output;
	}
	
	/**
	 * Checks if the service is valid
	 * @param service The service to be checked
	 * @return If the service is valid, returns null. If not, returns a Status indicating an error.
	 */
	private String checkService(CloudService service){
		if (service==null){
			Status status = new Status();
			return status.storageTypeError();
		}
		else{
			return null;
		}
	}
}
