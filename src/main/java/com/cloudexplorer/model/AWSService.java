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

public class AWSService implements CloudService {
	private AmazonS3 s3;
	
	public AWSService(){
		s3 = new AmazonS3Client(new BasicAWSCredentials("AKIAIFLT6SG5RMGIYKZA","/EoEpToBa2EBQQd+NJgF0IFG0+OVE1z52ngJQnzu"));
		s3.setRegion(Region.getRegion(Regions.US_WEST_1));
	}

	@Override
	public String listStorage() {
		try{
			ObjectMapper mapper = new ObjectMapper();
			String output = mapper.writeValueAsString(s3.listBuckets());
			return output;
		} catch (AmazonServiceException ase) {
            ase.printStackTrace();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ("Something weird happened");
	}

	@Override
	public String listFiles(String storageName) {
		try{
			ObjectMapper mapper = new ObjectMapper();
			String output = mapper.writeValueAsString(s3.listObjects(storageName));
			return output;
		} catch (AmazonServiceException ase) {
            ase.printStackTrace();
        } catch (AmazonClientException ace) {
            ace.printStackTrace();
        } catch (JsonGenerationException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return ("Something weird happened");
	}

	@Override
	public String uploadFile(InputStream uploadedInputStream) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String downloadFile(String key) {
		// TODO Auto-generated method stub
		return null;
	}

}
