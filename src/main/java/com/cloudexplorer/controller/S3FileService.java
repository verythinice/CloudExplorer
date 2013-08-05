package com.cloudexplorer.controller;

//import java.io.File;
//import java.io.FileOutputStream;
//import java.io.IOException;
//import java.io.File;
//import java.io.FileInputStream;
import java.io.InputStream;
//import java.io.OutputStream;






import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.BasicAWSCredentials;
//import com.amazonaws.auth.ClasspathPropertiesFileCredentialsProvider;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectListing;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

@Path("/file")
public class S3FileService {

	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail) {

		String key = fileDetail.getFileName();
		// save it
		String output = uploadToS3(uploadedInputStream, key);

		return Response.status(200).entity(output).build();

	}
	
	@POST
	@Path("/list")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response listFiles(@FormDataParam ("bucket") String bucket){
		String output = listObjectsInBucket(bucket);
		return Response.status(200).entity(output).build();
	}
	
	//Upload to S3 (Hopefully...)
	private String uploadToS3(InputStream uploadedInputStream, String key){
		AmazonS3 s3 = new AmazonS3Client(new BasicAWSCredentials("AKIAIFLT6SG5RMGIYKZA","/EoEpToBa2EBQQd+NJgF0IFG0+OVE1z52ngJQnzu"));
		Region usWest1 = Region.getRegion(Regions.US_WEST_1);
		s3.setRegion(usWest1);
		try{
			s3.putObject(new PutObjectRequest("bstestbucket", key, uploadedInputStream, new ObjectMetadata()));
		} catch (AmazonServiceException ase) {
            return ase.toString();
        } catch (AmazonClientException ace) {
            return ace.toString();
        }
		return "woot";
	}
	
	//List the objects in the bucket
	private String listObjectsInBucket(String bucket){
		AmazonS3 s3 = new AmazonS3Client(new BasicAWSCredentials("AKIAIFLT6SG5RMGIYKZA","/EoEpToBa2EBQQd+NJgF0IFG0+OVE1z52ngJQnzu"));
		Region usWest1 = Region.getRegion(Regions.US_WEST_1);
		s3.setRegion(usWest1);
		try{
			String output = "";
			ObjectListing objectListing = s3.listObjects(bucket);
			for (S3ObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                output = output+(" - " + objectSummary.getKey() + "  " +
                                   "(size = " + objectSummary.getSize() + ")\r\n");
            }
			return output;
		} catch (AmazonServiceException ase) {
            return ase.toString();
        } catch (AmazonClientException ace) {
            return ace.toString();
        }
	}

	// save uploaded file to new location
	/*private void writeToFile(InputStream uploadedInputStream,
			String uploadedFileLocation) {

		try {
			OutputStream out = new FileOutputStream(new File(
					uploadedFileLocation));
			int read = 0;
			byte[] bytes = new byte[1024];

			while ((read = uploadedInputStream.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}
			out.flush();
			out.close();
		} catch (IOException e) {

			e.printStackTrace();
		}

	}
	*/

}