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
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.cloudexplorer.util.Status;

public class AWSService implements CloudService {
	private AmazonS3 s3;
	private static AWSService instance;
	
	
	//TODO figure out how to do this in a properties file
	private AWSService(){
		s3 = new AmazonS3Client(new BasicAWSCredentials("AKIAIFLT6SG5RMGIYKZA","/EoEpToBa2EBQQd+NJgF0IFG0+OVE1z52ngJQnzu"));
		s3.setRegion(Region.getRegion(Regions.US_WEST_1));
	}

	@Override
	public String listStorage() {
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(s3.listBuckets());
		} catch (AmazonServiceException ase) {
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
		}
		return output;
	}

	@Override
	public String listObjects(String storageName) {
		String output;
		try{
			ObjectMapper mapper = new ObjectMapper();
			output = mapper.writeValueAsString(s3.listObjects(storageName));
		} catch (AmazonServiceException ase) {
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
			else{
				output = mapper.writeValueAsString(new Status(0, "Error moving file"));
			}
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
			else{
				output = mapper.writeValueAsString(new Status(0, "Error renaming file"));
			}
		} catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
            ase.printStackTrace();
            output = ase.toString();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
            output = ace.toString();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (JsonMappingException e) {
			e.printStackTrace();
			output = e.toString();
		} catch (IOException e) {
			e.printStackTrace();
			output = e.toString();
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
