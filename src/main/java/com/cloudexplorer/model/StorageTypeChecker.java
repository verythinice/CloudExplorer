package com.cloudexplorer.model;

public final class StorageTypeChecker {
	private StorageTypeChecker(){}
	
	public static CloudService returnCorrectStorageType(String storageType){
		if (storageType.equals("aws")){
			return (new AWSService());
		}
		else{
			return null;
		}
	}
}
