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
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
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
			//return output; testing for redundancy
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
			return output;
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
	
	public String copyFile(String source, String destination, String key){
		String output;
		try{
			s3.copyObject(new CopyObjectRequest(source, key, destination, key));
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

}
