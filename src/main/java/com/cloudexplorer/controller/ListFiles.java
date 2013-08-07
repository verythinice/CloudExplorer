package com.cloudexplorer.controller;

import java.io.InputStream;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.StorageTypeChecker;
import com.cloudexplorer.util.Status;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/object")
@Produces(MediaType.APPLICATION_JSON)
public class ListFiles {
	@GET
	@Path("/list")
	public String listObjects(@QueryParam("type") String storageService, @QueryParam("name") String storageName) {
		CloudService service = StorageTypeChecker.returnCorrectStorageType(storageService);
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
			@QueryParam("name") String fileName){
		CloudService service = StorageTypeChecker.returnCorrectStorageType(storageService);
		String output = checkService(service);
		if(output==null){
			output = service.copyFile(source, destination, fileName);
		}
		return output;
	}
	
	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public String uploadFile(
			@FormDataParam("storageService") String storageService,
			@FormDataParam("storageName") String storageName,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {
		String key = fileDetail.getFileName();
		CloudService service = StorageTypeChecker.returnCorrectStorageType(storageService);
		if (service==null){
			Status status = new Status();
			return status.storageTypeError();
		}
		String output = service.uploadFile(storageName, key, uploadedInputStream);
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
