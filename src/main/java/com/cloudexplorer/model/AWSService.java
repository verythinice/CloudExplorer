package com.cloudexplorer.model;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.DeleteObjectsRequest;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ListObjectsRequest;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.cloudexplorer.util.AWSCredentials;
import com.cloudexplorer.util.Status;

public class AWSService implements CloudService {
	private AmazonS3 s3;
	private ObjectListing currentList = null;
	private ArrayList<String> markers = null;
	private static AWSService instance;
	private static final int DEFAULT_MAX_OBJECTS = 2;
	
	
	private AWSService(){
		s3 = new AmazonS3Client(new BasicAWSCredentials(AWSCredentials.getAccessKey(), AWSCredentials.getSecretKey()));
		s3.setRegion(Region.getRegion(Regions.US_WEST_1));
	}

	@Override
	public String listStorage() {
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(s3.listBuckets());
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}

	@Override
	public String listObjects(String storageName) {
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			ListObjectsRequest request = generateRequest(storageName, null);
			currentList = s3.listObjects(request);
			output = mapper.writeValueAsString(currentList);
			if (markers != null && !markers.isEmpty()){
				markers.clear();
			}
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String listNext(){
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			if (currentList.isTruncated()){
				currentList = s3.listNextBatchOfObjects(currentList);
				output = mapper.writeValueAsString(currentList);
				if (markers == null){
					markers = new ArrayList<String>();
				}
				markers.add(currentList.getMarker());
			}
			else{
				output = mapper.writeValueAsString(new Status(0,"next list does not exist"));
			}
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String listPrevious(){
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			if(markers == null || markers.isEmpty()){
				Status status = new Status(0,"no previous list");
				output = mapper.writeValueAsString(status);
				return output;
			}
			else if(markers.size()==1){
				output = listObjects(currentList.getBucketName());
				markers.clear();
				return output;
			}
			else{
				int index = markers.indexOf(currentList.getMarker())-1;
				currentList = s3.listObjects(generateRequest(currentList.getBucketName(), markers.get(index)));
				output = mapper.writeValueAsString(currentList);
				markers.remove(markers.size()-1);
			}
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}

	@Override
	public String uploadObject(String storageName, String name, InputStream uploadedInputStream) {
		String output;
		try{
			s3.putObject(new PutObjectRequest(storageName, name, uploadedInputStream, new ObjectMetadata()));
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(new Status(1,"File uploaded successfully"));
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}

	@Override
	public File downloadObject(String storageName, String name) {
		S3Object object = null;
		S3ObjectInputStream in = null;
		FileOutputStream out = null;
		try{
			object = s3.getObject(new GetObjectRequest(storageName, name));
			in = object.getObjectContent();
			File file = File.createTempFile("temp", ".tmp");
			out = new FileOutputStream(file);
			
			int read = 0;
			byte[] bytes = new byte[1024];
			while ((read = in.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}
			return file;
		} catch (AmazonServiceException ase) {
            ase.printStackTrace();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
        } catch (IOException e) {
			e.printStackTrace();
		} finally{
			if (object != null){
				try{
					object.close();
				} catch (IOException e){
					e.printStackTrace();
				}
			}
			if (in != null) {
				try {
					in.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			if (out != null) {
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}	
			}
		}
		return null;
	}
	
	public String copyObject(String source, String destination, String name, String newName){
		String output;
		try{
			if (checkKeyInBucket(destination, newName)){
				if (newName.lastIndexOf('.')!=-1){
					newName = newName.substring(0, newName.lastIndexOf('.'))+"_copy_"+System.currentTimeMillis()+newName.substring(newName.lastIndexOf('.'));
				}
				else{
					newName = newName+"_copy_"+System.currentTimeMillis();
				}
			}
			s3.copyObject(new CopyObjectRequest(source, name, destination, newName));
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(new Status(1,"File copied successfully"));
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String deleteObject(String storageName, String name){
		String output;
		try{
			s3.deleteObject(storageName, name);
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(new Status(1,"File deleted successfully"));
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String moveObject(String source, String destination, String name, String newName){
		String copyOutput = copyObject(source, destination, name, newName);
		String deleteOutput = deleteObject(source, name);
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			Status copyStatus = mapper.readValue(copyOutput, Status.class);
			Status deleteStatus = mapper.readValue(deleteOutput, Status.class);
			if (copyStatus.getStatus()==1&&deleteStatus.getStatus()==1){
				output = mapper.writeValueAsString(new Status(1, "File moved successfuly"));
			}
			else if (copyStatus.getStatus()==0){
				return copyStatus.toString();
			}
			else if(deleteStatus.getStatus()==0){
				return deleteStatus.toString();
			}
 			else{
 				output = mapper.writeValueAsString(new Status(0, "Error moving file"));				
 			}
		} catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String renameObject(String storageName, String name, String newName){
		String copyOutput = copyObject(storageName, storageName, name, newName);
		String deleteOutput = deleteObject(storageName, name);
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			Status copyStatus = mapper.readValue(copyOutput, Status.class);
			Status deleteStatus = mapper.readValue(deleteOutput, Status.class);
			if (copyStatus.getStatus()==1&&deleteStatus.getStatus()==1){
				output = mapper.writeValueAsString(new Status(1, "File renamed successfuly"));
			}
			else if (copyStatus.getStatus()==0){
				return copyStatus.toString();
			}
			else if(deleteStatus.getStatus()==0){
				return deleteStatus.toString();
			}
 			else{
 				output = mapper.writeValueAsString(new Status(0, "Error renaming file"));				
 			}

		} catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	public String deleteMultipleObjects(String storageName, List<String> fileNames){
		String output;
		ArrayList<DeleteObjectsRequest.KeyVersion> keyList = new ArrayList<DeleteObjectsRequest.KeyVersion>();
		for (String name : fileNames){
			keyList.add(new DeleteObjectsRequest.KeyVersion(name));
		}
		try{
			DeleteObjectsRequest request = new DeleteObjectsRequest(storageName);
			request.setKeys(keyList);
			s3.deleteObjects(request);
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(new Status(1,"Files deleted successfully"));
		} catch (AmazonServiceException ase) {
            Status status = new Status(0, ase.toString());
            output = status.toString();
        } catch (AmazonClientException ace) {
        	Status status = new Status(0, ace.toString());
            output = status.toString();
        } catch (JsonGenerationException e) {
        	Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (JsonMappingException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		} catch (IOException e) {
			Status status = new Status(0, e.toString());
            output = status.toString();
		}
		return output;
	}
	
	/**
	 * The method that instantiates and returns the singleton.
	 * @return The singleton instance of AWSService
	 */
	public static AWSService getInstance(){
		if (instance == null){
			instance = new AWSService();
		}
		return instance;
	}
	
	private ListObjectsRequest generateRequest(String storageName, String marker){
		ListObjectsRequest request = new ListObjectsRequest();
		request.setBucketName(storageName);
		request.setMarker(marker);
		request.setMaxKeys(DEFAULT_MAX_OBJECTS);
		return request;
	}
	
	/*
	 * Checks if a specified key is in a bucket. 
	 * Used for Copy, because aws won't let something be copied with the same name into the same bucket.
	 */
	private boolean checkKeyInBucket(String bucketName, String key){
		ObjectListing objects = null;
		boolean keyContained=false;
		do{
			if (objects==null){
				objects = s3.listObjects(bucketName);
			}
			else{
				objects = s3.listNextBatchOfObjects(objects);
			}
			for (S3ObjectSummary o : objects.getObjectSummaries()){
				if (o.getKey().equals(key)){
					keyContained = true;
				}
			}
		}while (objects.isTruncated());
		return keyContained;
	}


}
