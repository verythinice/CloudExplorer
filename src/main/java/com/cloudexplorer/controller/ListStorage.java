package com.cloudexplorer.controller;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
//import javax.ws.rs.core.Response;

import com.cloudexplorer.model.AWSService;
import com.cloudexplorer.model.CloudService;

@Path("/storage")
public class ListStorage{
	
	@GET
	@Path("/{param}")
	@Produces(MediaType.APPLICATION_JSON)
	public String listBuckets(@PathParam("param") String msg) {
		CloudService service;
		//TODO service check call
		if (msg.equals("aws")){
			service = new AWSService();
		}
		else{
			return ("Invalid storage type");
		}
		String output = service.listStorage();
		return output;
	}
}
