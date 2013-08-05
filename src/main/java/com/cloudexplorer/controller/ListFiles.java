package com.cloudexplorer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.cloudexplorer.model.AWSService;
import com.cloudexplorer.model.CloudService;

@Path("/object")
@Produces(MediaType.APPLICATION_JSON)
public class ListFiles {
	@GET
	@Path("/{storageService}/{storageName}")
	public String listObjects(@PathParam("storageService") String storageService, @PathParam("storageName") String storageName) {
		CloudService service;
		//TODO Service check call
		service = new AWSService();
		String output = service.listFiles(storageName);
		return output;
	}//this is a comment
}
