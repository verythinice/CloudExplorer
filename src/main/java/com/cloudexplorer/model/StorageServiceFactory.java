/*
 * A factory class that returns the correct storage service. Currently only supports aws.
 */
package com.cloudexplorer.model;

public final class StorageServiceFactory {
	private StorageServiceFactory(){}
	
	/*
	 * To implement more cloud storages services in the future, just add more if else statements.
	 */
	public static CloudService returnCorrectStorageType(String storageType){
		if (storageType.equals("aws")){
			return (new AWSService());
		}
		else{
			return null;
		}
	}
}
