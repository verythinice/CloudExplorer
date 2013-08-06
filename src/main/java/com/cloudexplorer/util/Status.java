package com.cloudexplorer.util;

import java.io.IOException;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

public class Status {
	private int status;
	private String message;
	
	public Status(){
		
	}
	
	public String storageTypeError(){
		status = 0;
		message = "Storage type not found";
		try{
			ObjectMapper mapper = new ObjectMapper();
			String output = mapper.writeValueAsString(this);
			return output;
        } catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ("Error converting error message to JSON");
	}
	
	public int getStatus(){
		return status;
	}
	
	public String getMessage(){
		return message;
	}
	
	public void setStatus(int i){
		status = i;
	}
	
	public void setMessage(String s){
		message = s;
	}
}
