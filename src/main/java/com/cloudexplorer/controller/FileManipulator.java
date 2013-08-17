/*
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
public class FileManipulator {
	/*
	 * Lists the objects in storage.
	 * Parameters: type = the type of cloud storage. Currently only supports AWS
	 * name: the name of the storage to list the files from
	 * Returns a JSON object of S3Object, which has object name, size, owner, etc. for each object
	 */
	@GET
	@Path("/list")
	public String listObjects(@QueryParam("type") String storageService, @QueryParam("name") String storageName) {
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if (output==null){
			output = service.listFiles(storageName);
		}
		return output;
	}
	
	/*
	 * Copies objects. can copy objects between storage, or into the same storage.
	 * Parameters: type = the type of cloud storage. Currently only supports AWS
	 * source = the source storage
	 * destination = the destination storage
	 * name = the name of the object to be copied
	 * newName = the new name the object is being copied to. Can be the same as name.
	 * If the name already exists in that storage, it automatically renames the object.
	 */
	@GET
	@Path("/copy")
	public String copyObject(
			@QueryParam("type") String storageService, 
			@QueryParam("source") String source,
			@QueryParam("destination") String destination,
			@QueryParam("name") String fileName,
			@QueryParam("newName") String newName){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.copyFile(source, destination, fileName, newName);
		}
		return output;
	}
	
	/*
	 * Deletes objects.
	 * Parameters: type = the type of cloud storage. Currently only supports AWS
	 * storageName = the name of the storage the object to be deleted is in
	 * name = the name of the object to be deleted
	 */
	@GET
	@Path("/delete")
	public String deleteObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String fileName){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.deleteFile(storageName, fileName);
		}
		return output;
	}
	
	/*
	 * Deletes multiple objects at once. The objects all need to be in the same bucket.
	 * 
	 */
	@POST
	@Path("/deleteMultiple")
	@Consumes(MediaType.APPLICATION_JSON)
	public String deleteMultipleObjects(MultipleDeleteInput in){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(in.getType());
		String output = checkService(service);
		if(output==null){
			output = service.deleteMultipleFiles(in.getStorageName(), in.getNames());
		}
		return output;
	}
	
	/*
	 * Uploads an object to the specified storage.
	 * Parameters: storageService = the type of cloud storage. Currently only supports AWS
	 * storageName = the storage to upload the file to
	 * file = the file to upload
	 */
	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadObject(
			@FormDataParam("storageService") String storageService,
			@FormDataParam("storageName") String storageName,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {
		String key = fileDetail.getFileName();
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.uploadFile(storageName, key, uploadedInputStream);
		}
		return output;
	}
	
	@GET
	@Path("/download")
	public Response downloadObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String fileName){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		File file;
		if(output==null){
			file = service.downloadFile(storageName, fileName);
		}
		else{
			return null;
		}
		ResponseBuilder response = Response.ok((Object) file);
		response.header("Content-Disposition",
				"attachment; filename="+fileName);
		return response.build();
	}
	
	@GET
	@Path("/move")
	public String moveObject(
			@QueryParam("type") String storageService, 
			@QueryParam("source") String source,
			@QueryParam("destination") String destination,
			@QueryParam("name") String fileName){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.moveFile(source, destination, fileName, fileName);
		}
		return output;
	}
	
	@GET
	@Path("/rename")
	public String renameObject(
			@QueryParam("type") String storageService,
			@QueryParam("storage") String storageName,
			@QueryParam("name") String name,
			@QueryParam("newName") String newName){
		CloudService service = CloudServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.renameFile(storageName, name, newName);
		}
		return output;
	}
	
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
