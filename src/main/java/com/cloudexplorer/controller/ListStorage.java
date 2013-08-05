package com.cloudexplorer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.StorageTypeChecker;

@Path("/storage")
public class ListStorage{
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public String listBuckets(@QueryParam("type") String storageService) {
		CloudService service;
		service = StorageTypeChecker.returnCorrectStorageType(storageService);
		String output = service.listStorage();
		return output;
	}
}
