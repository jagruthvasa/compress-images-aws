const sharp = require("sharp");
const s3Service = require("./s3service");
const Request = require("../models/request");
const Product = require("../models/product");
const { generateCSV } = require("./csvService");

let fetch;
(async () => {
	fetch = (await import("node-fetch")).default;
})();

const mimeTypes = {
	jpeg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	avif: "image/avif",
	tiff: "image/tiff",
};

async function processImage(url, imageName) {
	try {
		console.log("url ", url);

		const response = await fetch(url);

		// Use arrayBuffer() and convert to Buffer
		const arrayBuffer = await response.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Determine the format of the image
		const { format } = await sharp(buffer).metadata();

		console.log("format : " + format);

		// Check if the format is supported
		const supportedFormats = [
			"jpeg",
			"png",
			"webp",
			"gif",
			"avif",
			"tiff",
		];

		if (!supportedFormats.includes(format)) {
			throw new Error(`Unsupported image format: ${format}`);
		}

		// Print size before compression
		console.log(`Size before compression: ${buffer.length / 1024} KB`);

		const compressionOptions = { quality: 50 };

		const compressedBuffer = await sharp(buffer)
			.toFormat(format, compressionOptions)
			.toBuffer();

		// Print size after compression
		console.log(
			`Size after compression: ${compressedBuffer.length / 1024} KB`
		);

            const contentType = mimeTypes[format] || 'application/octet-stream';

		const outputFileName = `${imageName}_output.${format}`;
		const outputUrl = await s3Service.uploadFile(
			compressedBuffer,
			outputFileName,
                  contentType
		);

		return outputUrl;
	} catch (error) {
		console.error("Error processing image:", error);
		throw error;
	}
}

exports.processImages = async (requestId, csvData, webhookUrl) => {
	try {
		await Request.updateStatus(requestId, "processing");

		for (const record of csvData) {
			const inputUrls = record["Input Image Urls"].split(",");

			for (let i = 0; i < inputUrls.length; i++) {
				const inputUrl = inputUrls[i].trim();

                        if (inputUrl == '') continue;

				const productId = await Product.create(
					requestId,
					record["Serial Number"],
					record["Product Name"],
					inputUrl
				);

				const fileName = inputUrl.substring(
					inputUrl.lastIndexOf("/") + 1
				);

				const imageName = fileName.substring(
					0,
					fileName.lastIndexOf(".")
				);

				try {
					const outputUrl = await processImage(
						inputUrl,
						imageName
					);
					await Product.updateOutputUrl(
						productId,
						outputUrl
					);
				} catch (imageError) {
					await Product.updateOutputUrl(
						productId,
						imageError.message ||
							"Failed to process image"
					);
				}
			}
		}

		await generateCSV(requestId, webhookUrl);
	} catch (error) {
		console.error("Error processing images:", error);
		await Request.updateStatus(requestId, "failed");
	}
};
