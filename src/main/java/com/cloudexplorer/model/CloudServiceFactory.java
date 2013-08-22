/**
 * A factory class that returns the correct cloud storage service. Currently only supports aws.
 * <p>
 * To add more cloud services in the future, have them implement the CloudService interface.
 * Then add more if else statements under the aws one.
 */
package com.cloudexplorer.model;

public final class CloudServiceFactory {
	private CloudServiceFactory(){}
	
	/**
	 * Returns a CloudService
	 * @param  storageType  A string indicating which storage type to return.
	 * @return A cloudService
	 */
	public static CloudService checkStorage(String storageType, CloudService service){
		if (storageType.equals("aws")){
			return (AWSService.getInstance());
		}
		else{
			return null;
		}
	}
}
