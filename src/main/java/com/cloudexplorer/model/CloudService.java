package com.cloudexplorer.model;

import java.io.InputStream;

public interface CloudService {
	public String listStorage();
	public String listFiles(String storageName);
	public String uploadFile(String storageName, String fileName, InputStream uploadedInputStream);
	public String downloadFile(String storageName, String fileName);
	public String copyFile(String source, String destination, String sourceKey, String destinationKey);
	public String deleteFile(String storageName, String fileName);
	public String moveFile(String source, String destination, String sourceKey, String destinationKey);
	public String renameFile(String storageName, String name, String newName);
}
