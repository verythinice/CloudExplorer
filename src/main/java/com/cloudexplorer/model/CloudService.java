package com.cloudexplorer.model;

import java.io.InputStream;

public interface CloudService {
	public String listStorage();
	public String listFiles(String storageName);
	public String uploadFile(InputStream uploadedInputStream);
	public String downloadFile(String key);
}
