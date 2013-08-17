/*
 * The interface for cloud services. To create a new cloud service, implement this interface, and add it to CloudServiceFactory.
 */
package com.cloudexplorer.model;

import java.io.File;
import java.io.InputStream;
import java.util.List;

public interface CloudService {
	/*
	 * Lists the storage in the cloud service. Returns a JSON object of the list of storages.
	 */
	public String listStorage();
	
	/*
	 * Lists the files in a specified storage. 
	 * Parameter: storageName = the name of the storage.
	 * Returns a JSON object of the list of files.
	 */
	public String listFiles(String storageName);
	
	/*
	 * uploads a file to the specified storage.
	 * Parameters: storageName = the name of the storage the file is being uploaded to
	 * fileName = the name of the file to be uploaded
	 * uploadedInputStream = an InputStream of the file to be uploaded.
	 */
	public String uploadFile(String storageName, String fileName, InputStream uploadedInputStream);
	
	/*
	 * Downloads a file from the specified storage.
	 * Parameters: storageName = the name of the storage the file is being downloaded from
	 * fileName = the name of the file to be downloaded
	 * returns the file to be downloaded by the client
	 */
	public File downloadFile(String storageName, String fileName);
	
	/*
	 * Copies a file from one storage to another or within storage.
	 * Parameters: source = the name of the source storage
	 * destination = the name of the destination storage. Can be the same as source.
	 * sourceName = the name of the file to be copied
	 * destinationName = the name of the copied file. Can be the same as sourceName (if there is a conflict, the method in the implemented class should handle it)
	 */
	public String copyFile(String source, String destination, String sourceName, String destinationName);
	
	/*
	 * Deletes a file in the specified storage.
	 * Parameters: storageName = the name of the storage the file is being deleted from
	 * fileName = the name of the file to be deleted
	 */
	public String deleteFile(String storageName, String fileName);
	
	/*
	 * Moves a file from one storage to another
	 * Parameters: source = the name of the source storage
	 * destination = the name of the destination storage. Should not be the same as source
	 * sourceName = the name of the file to be moved
	 * destinationName = the name of the moved file. Will most likely be the same as sourceName. 
	 */
	public String moveFile(String source, String destination, String sourceName, String destinationName);
	
	/*
	 * Renames a file.
	 * Parameters: storageName = the name of the storage the file is being renamed in
	 * name = the original name of the file
	 * newName = the new name of the file
	 */
	public String renameFile(String storageName, String name, String newName);
	
	/*
	 * Deletes multiple files at once. All the files must be in the same storage
	 * Parameters: storageName = the name of the storage the files are being deleted from
	 * fileNames = a list of the names of the files to be deleted.
	 */
	public String deleteMultipleFiles(String storageName, List<String> fileNames);
}
