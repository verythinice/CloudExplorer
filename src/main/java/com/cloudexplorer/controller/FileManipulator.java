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
import com.cloudexplorer.model.StorageServiceFactory;
import com.cloudexplorer.util.MultipleDeleteInput;
import com.cloudexplorer.util.Status;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/object")
@Produces(MediaType.APPLICATION_JSON)
public class FileManipulator {
	@GET
	@Path("/list")
	public String listObjects(@QueryParam("type") String storageService, @QueryParam("name") String storageName) {
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if (output==null){
			output = service.listFiles(storageName);
		}
		return output;
	}
	
	@GET
	@Path("/copy")
	public String copyObject(
			@QueryParam("type") String storageService, 
			@QueryParam("source") String source,
			@QueryParam("destination") String destination,
			@QueryParam("name") String fileName,
			@QueryParam("newName") String newName){
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.copyFile(source, destination, fileName, newName);
		}
		return output;
	}
	
	@GET
	@Path("/delete")
	public String deleteObject(
			@QueryParam("type") String storageService,
			@QueryParam("storageName") String storageName,
			@QueryParam("name") String fileName){
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.deleteFile(storageName, fileName);
		}
		return output;
	}
	
	@POST
	@Path("/deleteMultiple")
	@Consumes(MediaType.APPLICATION_JSON)
	public String deleteMultipleObjects(MultipleDeleteInput in){
		CloudService service = StorageServiceFactory.returnCorrectStorageType(in.getType());
		String output = checkService(service);
		if(output==null){
			output = service.deleteMultipleFiles(in.getStorageName(), in.getNames());
		}
		return output;
	}
	
	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadObject(
			@FormDataParam("storageService") String storageService,
			@FormDataParam("storageName") String storageName,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {
		String key = fileDetail.getFileName();
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
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
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
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
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
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
		CloudService service = StorageServiceFactory.returnCorrectStorageType(storageService);
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
