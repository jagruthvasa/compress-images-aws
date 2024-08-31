const csv = require("csv-parser");
const { Readable } = require("stream");
const { fetchAggregatedProductData } = require("../models/product");
const s3Service = require("./s3service");
const Request = require("../models/request");
const { createObjectCsvStringifier } = require("csv-writer");
const { PassThrough } = require("stream");
const { triggerWebhook } = require("./webhook");

exports.parseCSV = (buffer) => {
	return new Promise((resolve, reject) => {
		const results = [];
		Readable.from(buffer)
			.pipe(csv())
			.on("data", (data) => results.push(data))
			.on("end", () => {
				if (results.length === 0) {
					reject(new Error("No data present in CSV"));
				} else if (!validateCSVStructure(results)) {
					reject(
						new Error(
							`Invalid CSV structure. Expected columns: "Serial Number", "Product Name", "Input Image Urls"`
						)
					);
				} else {
					resolve(results);
				}
			})
			.on("error", (error) => reject(error));
	});
};

function validateCSVStructure(data) {
	const requiredColumns = [
		"Serial Number",
		"Product Name",
		"Input Image Urls",
	];
	return requiredColumns.every((column) => data[0].hasOwnProperty(column));
}

exports.generateCSV = async (requestId, webhookUrl) => {
	try {
		// Fetch the aggregated product data
		const csvData = await fetchAggregatedProductData(requestId);

		if (csvData.length === 0) {
			throw new Error("No data available to generate CSV.");
		}

		// Prepare CSV records
		const records = csvData.map((product) => ({
			"S. No.": product.serial_number,
			"Product Name": product.product_name,
			"Input Image Urls": product.input_image_urls,
			"Output Image Urls": product.output_image_urls,
		}));

		// Create a CSV stringifier
		const csvStringifier = createObjectCsvStringifier({
			header: [
				{ id: "S. No.", title: "S. No." },
				{ id: "Product Name", title: "Product Name" },
				{ id: "Input Image Urls", title: "Input Image Urls" },
				{ id: "Output Image Urls", title: "Output Image Urls" },
			],
		});

		// Create CSV stream
		const csvStream = new PassThrough();
		csvStream.write(csvStringifier.getHeaderString());
		records.forEach((record) =>
			csvStream.write(csvStringifier.stringifyRecords([record]))
		);
		csvStream.end();

		const outputFileName = `csvs/${requestId}_output.csv`;
		const contentType = "text/csv";

		// Upload CSV to S3
		const cvsUrl = await s3Service.uploadFile(
			csvStream,
			outputFileName,
			contentType
		);
		console.log("CSV URL:", cvsUrl);

		// Update the request with the CSV URL
		await Request.updateCSV(requestId, cvsUrl);

		// Trigger the webhook
		if (webhookUrl) {
			await triggerWebhook(webhookUrl, requestId, cvsUrl);
		}
	} catch (error) {
		console.error("Error generating CSV:", error);

		// Handle any errors that occur during the CSV generation process
		await Request.updateStatus(requestId, "failed");
		await triggerWebhook(webhookUrl, requestId, null, error.message);
		throw error; // Optionally rethrow to let higher-level handlers catch it
	}
};
