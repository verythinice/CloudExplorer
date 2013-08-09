package com.cloudexplorer.model;

import java.io.IOException;
import java.io.InputStream;

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
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.cloudexplorer.util.Status;

public class AWSService implements CloudService {
	private AmazonS3 s3;
	
	public AWSService(){
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
	public String listFiles(String storageName) {
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
	public String uploadFile(String storageName, String fileName, InputStream uploadedInputStream) {
		String output;
		try{
			s3.putObject(new PutObjectRequest(storageName, fileName, uploadedInputStream, new ObjectMetadata()));
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
	public String downloadFile(String storageName, String fileName) {
		// TODO Auto-generated method stub
		return null;
	}
	
	public String copyFile(String source, String destination, String sourceKey, String destinationKey){
		String output;
		try{
			if (checkKeyInBucket(destination, destinationKey)){
				destinationKey = destinationKey+System.currentTimeMillis();
			}
			s3.copyObject(new CopyObjectRequest(source, sourceKey, destination, destinationKey));
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
	
	public String deleteFile(String storageName, String fileName){
		String output;
		try{
			s3.deleteObject(storageName, fileName);
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
	
	public String moveFile(String source, String destination, String sourceKey, String destinationKey){
		String copyOutput = copyFile(source, destination, sourceKey, destinationKey);
		String deleteOutput = deleteFile(source, sourceKey);
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
