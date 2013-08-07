package com.cloudexplorer.model;

import java.io.InputStream;

public interface CloudService {
	public String listStorage();
	public String listFiles(String storageName);
	public String uploadFile(String storageName, String fileName, InputStream uploadedInputStream);
	public String downloadFile(String storageName, String fileName);
	public String copyFile(String source, String destination, String key);
}
