package com.cloudexplorer.controller;

import java.io.InputStream;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.StorageTypeChecker;
import com.cloudexplorer.util.Status;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

/*@Path("/object")
@Produces(MediaType.APPLICATION_JSON)*/																												
public class UploadFile {
	
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
}
