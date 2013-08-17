/*
 * A factory class that returns the correct cloud storage service. Currently only supports aws.
 */
package com.cloudexplorer.model;

public final class CloudServiceFactory {
	private CloudServiceFactory(){}
	
	/*
	 * To add more cloud storages services in the future, have them implement the CloudService interface.
	 * Then just add more if else statements.
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
