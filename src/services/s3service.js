const AWS = require("aws-sdk");

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

exports.uploadFile = async (body, fileName, contentType) => {
	const params = {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: body,
		ContentType: contentType,
	};

	try {
		const uploadResult = await s3.upload(params).promise();
		console.log("Upload to aws successfully " + fileName);
		console.log("upload file url : " + uploadResult.Location);
		return uploadResult.Location;
	} catch (error) {
		console.error("Error uploading file to S3:", error);

		if (error.code === "NoSuchBucket") {
			throw new Error("The specified S3 bucket does not exist.");
		} else if (error.code === "InvalidAccessKeyId") {
			throw new Error(
				"The AWS Access Key ID you provided does not exist."
			);
		} else if (error.code === "AccessDenied") {
			throw new Error(
				"Access denied. Check your S3 bucket permissions."
			);
		} else {
			throw new Error(
				"An error occurred while uploading the file. Please try again later."
			);
		}
	}
};
