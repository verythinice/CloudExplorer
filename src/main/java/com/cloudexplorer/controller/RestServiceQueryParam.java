package com.cloudexplorer.controller;

import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
 
@Path("/query")
public class RestServiceQueryParam {
 
	@GET
	@Path("/{param}")
	public Response getMsg(@DefaultValue("Dale") @QueryParam("msg") String msg) {
 
		String output = "Jersey say : " + msg;
 
		return Response.status(200).entity(output).build();
 
	}
 
}

/*
@Path("/query")
public class RestServiceQueryParam {

	@GET
	@Path("/param")
	public Response getUsers(@DefaultValue("1000") @QueryParam("from") int from,
			@DefaultValue("999")@QueryParam("to") int to,
			@DefaultValue("name") @QueryParam("orderBy") List<String> orderBy) {

		return Response
				.status(200)
				.entity("getUsers is called, from : " + from + ", to : " + to
						+ ", orderBy" + orderBy.toString()).build();

	}

}
*/