package com.cloudexplorer.controller;

import java.io.IOException;
import java.util.ArrayList;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

@Path("/hello")
public class RestServicePathParam {

	@GET
	@Path("/{param}")
	@Produces(MediaType.APPLICATION_JSON)
	public String getMsg(@PathParam("param") String msg) {
		ObjectMapper mapper = new ObjectMapper();
		Integer stringList = new Integer(9001);
		/*ArrayList<String> stringList = new ArrayList<String>();
		stringList.add(msg);
		stringList.add("Did this work?");*/
		try{
			String output = mapper.writeValueAsString(stringList);
			return output;
		}
		catch (JsonGenerationException e) {
			 
			e.printStackTrace();
	 
		} catch (JsonMappingException e) {
	 
			e.printStackTrace();
	 
		} catch (IOException e) {
	 
			e.printStackTrace();
	 
		}
		return ("Something weird happened");

	}

}

/*
@Path("/pathparam")
public class RestServicePathParam {

	@GET
	@Path("{id}")
	public Response getUserById(@PathParam("id") String id) {

		return Response.status(200).entity("getUserById is called, id : " + id)
				.build();

	}

	@GET
	@Path("{year}/{month}/{day}")
	public Response getUserHistory(@PathParam("year") int year,
			@PathParam("month") int month, @PathParam("day") int day) {

		String date = year + "/" + month + "/" + day;

		return Response.status(200)
				.entity("getUserHistory is called, year/month/day : " + date)
				.build();

	}
	
}
*/