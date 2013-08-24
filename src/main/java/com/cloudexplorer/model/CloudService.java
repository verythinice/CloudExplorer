/**
 * The interface for cloud services. To create a new cloud service, 
 * implement this interface, and add it to CloudServiceFactory.
 */
package com.cloudexplorer.model;

import java.io.File;
import java.io.InputStream;
import java.util.List;

public interface CloudService {
	/**
	 * Lists the storage in the cloud service. 
	 * @return A JSON object of the list of storages.
	 */
	public String listStorage();
	
	/**
	 * Lists the objects in a specified storage. 
	 * @param  storageName  the name of the storage.
	 * @return a JSON object of the list of objects.
	 */
	public String listObjects(String storageName);
	
	/**
	 * Lists the next page of objects
	 * @return a JSON object of the next list of objects
	 */
	public String listNext();
	
	/**
	 * Lists the previous page of objects.
	 * @return a JSON object of the previous list of objects.
	 */
	public String listPrevious();
	
	/**
	 * uploads an object to the specified storage.
	 * @param  storageName  The name of the storage the object is being uploaded to
	 * @param  name  The name of the object to be uploaded
	 * @param  uploadedInputStream  An InputStream of the object to be uploaded.
	 * @return A status message indicating that the object uploaded successfully
	 */
	public String uploadObject(String storageName, String name, InputStream uploadedInputStream);
	
	/**
	 * Downloads an object from the specified storage.
	 * @param  storageName  the name of the storage the object is being downloaded from
	 * @param  name  the name of the object to be downloaded
	 * @return The object to be downloaded by the client
	 */
	public File downloadObject(String storageName, String name);
	
	/**
	 * Copies an object from one storage to another or within storage.
	 * @param  source  The name of the source storage
	 * @param  destination  The name of the destination storage. Can be the same as source.
	 * @param  name  The name of the object to be copied
	 * @param  newName  The name of the copied object. Can be the same as sourceName 
	 * (if there is a conflict, the method in the implemented class should handle it)
	 * @return A status message indicating that the object copied successfully
	 */
	public String copyObject(String source, String destination, String name, String newName);
	
	/**
	 * Deletes an object in the specified storage.
	 * @param  storageName  The name of the storage the object is being deleted from
	 * @param  name  The name of the object to be deleted
	 * @return A status message indicating that the object deleted successfully
	 */
	public String deleteObject(String storageName, String name);
	
	/**
	 * Moves an object from one storage to another
	 * @param  source  The name of the source storage
	 * @param  destination  The name of the destination storage. Should not be the same as source
	 * @param  name  The name of the object to be moved
	 * @param  newName  The name of the moved object. Will most likely be the same as sourceName.
	 * @return A status message indicating that the object moved successfully 
	 */
	public String moveObject(String source, String destination, String name, String newName);
	
	/**
	 * Renames an object.
	 * @param  storageName  The name of the storage the file is being renamed in
	 * @param  name  The original name of the object
	 * @param  newName  The new name of the object
	 * @return A status message indicating that the object was renamed successfully
	 */
	public String renameObject(String storageName, String name, String newName);
	
	/**
	 * Deletes multiple objects at once. All the objects must be in the same storage
	 * @param  storageName  The name of the storage the objects are being deleted from
	 * @param  fileNames  A list of the names of the objects to be deleted.
	 * @return A status message indicating that all the objects deleted successfully
	 */
	public String deleteMultipleObjects(String storageName, List<String> fileNames);
}
