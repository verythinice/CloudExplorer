package com.cloudexplorer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.CloudService;
import com.cloudexplorer.model.CloudServiceFactory;
import com.cloudexplorer.util.Status;

@Path("/storage")
public class ListStorage{
	
	@GET
	@Path("/list")
	@Produces(MediaType.APPLICATION_JSON)
	public String listBuckets(@QueryParam("type") String storageService) {
		CloudService service;
		service = CloudServiceFactory.returnCorrectStorageType(storageService);
		if (service==null){
			Status status = new Status();
			return status.storageTypeError();
		}
		String output = service.listStorage();
		return output;
	}
}
