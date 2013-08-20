/**
 * A factory class that returns the correct cloud storage service. Currently only supports aws.
 * <p>
 * To add more cloud services in the future, have them implement the CloudService interface.
 * Then add more if else statements.
 */
package com.cloudexplorer.model;

public final class CloudServiceFactory {
	private CloudServiceFactory(){}
	
	/**
	 * Returns a CloudService
	 * @param  storageType  A string indicating which storage type to return.
	 * @return A cloudService
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
