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
	 * Lists the files in a specified storage. 
	 * @param  storageName  the name of the storage.
	 * @return a JSON object of the list of files.
	 */
	public String listObjects(String storageName);
	
	/**
	 * uploads a file to the specified storage.
	 * @param  storageName  The name of the storage the file is being uploaded to
	 * @param  name  The name of the file to be uploaded
	 * @param  uploadedInputStream  An InputStream of the file to be uploaded.
	 * @return A status message indicating that the file uploaded successfully
	 */
	public String uploadObject(String storageName, String name, InputStream uploadedInputStream);
	
	/**
	 * Downloads a file from the specified storage.
	 * @param  storageName  the name of the storage the file is being downloaded from
	 * @param  name  the name of the file to be downloaded
	 * @return The file to be downloaded by the client
	 */
	public File downloadObject(String storageName, String name);
	
	/**
	 * Copies a file from one storage to another or within storage.
	 * @param  source  The name of the source storage
	 * @param  destination  The name of the destination storage. Can be the same as source.
	 * @param  name  The name of the file to be copied
	 * @param  newName  The name of the copied file. Can be the same as sourceName 
	 * (if there is a conflict, the method in the implemented class should handle it)
	 * @return A status message indicating that the file copied successfully
	 */
	public String copyObject(String source, String destination, String name, String newName);
	
	/**
	 * Deletes a file in the specified storage.
	 * @param  storageName  The name of the storage the file is being deleted from
	 * @param  name  The name of the file to be deleted
	 * @return A status message indicating that the file deleted successfully
	 */
	public String deleteObject(String storageName, String name);
	
	/**
	 * Moves a file from one storage to another
	 * @param  source  The name of the source storage
	 * @param  destination  The name of the destination storage. Should not be the same as source
	 * @param  name  The name of the file to be moved
	 * @param  newName  The name of the moved file. Will most likely be the same as sourceName.
	 * @return A status message indicating that the file moved successfully 
	 */
	public String moveObject(String source, String destination, String name, String newName);
	
	/**
	 * Renames a file.
	 * @param  storageName  The name of the storage the file is being renamed in
	 * @param  name  The original name of the file
	 * @param  newName  The new name of the file
	 * @return A status message indicating that the file renamed successfully
	 */
	public String renameObject(String storageName, String name, String newName);
	
	/**
	 * Deletes multiple files at once. All the files must be in the same storage
	 * @param  storageName  The name of the storage the files are being deleted from
	 * @param  fileNames  A list of the names of the files to be deleted.
	 * @return A status message indicating that all the files deleted successfully
	 */
	public String deleteMultipleObjects(String storageName, List<String> fileNames);
}
