package com.cloudexplorer.util;

import java.util.ArrayList;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class MultipleDeleteInput {
	private String type;
	private String storageName;
	private ArrayList<String> names;
	
	public MultipleDeleteInput(){
	}
	
	public String getType(){
		return type;
	}
	
	public String getStorageName(){
		return storageName;
	}
	
	public ArrayList<String> getNames(){
		return names;
	}
	
	public void setType(String s){
		type=s;
	}
	
	public void setStorageName(String s){
		storageName=s;
	}
	
	public void setNames(ArrayList<String> list){
		names=list;
	}

}
