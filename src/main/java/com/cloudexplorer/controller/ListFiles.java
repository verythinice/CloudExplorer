package com.cloudexplorer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.StorageTypeChecker;

@Path("/object")
@Produces(MediaType.APPLICATION_JSON)
public class ListFiles {
	@GET
	@Path("/list")
	public String listObjects(@QueryParam("type") String storageService, @QueryParam("name") String storageName) {
		CloudService service;
		service = StorageTypeChecker.returnCorrectStorageType(storageService);
		String output = service.listFiles(storageName);
		return output;
	}//this is a comment
}
