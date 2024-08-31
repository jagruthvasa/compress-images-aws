const { v4: uuidv4 } = require("uuid");
const csvService = require("../services/csvService");
const Request = require("../models/request");
const Product = require("../models/product");
const imageProcessingService = require("../services/imageProcessingService");

exports.uploadCSV = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: "No file uploaded" });
	}

      const { webhookUrl } = req.body;

	try {
		const csvData = await csvService.parseCSV(req.file.buffer);

            const requestId = uuidv4();

		await Request.create(requestId, "pending");

		// Start asynchronous processing
		imageProcessingService.processImages(requestId, csvData, webhookUrl);

		res.status(200).json({
			requestId,
			message: "Your file has been accepted and is being processed.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Error processing CSV file",
			details: error.message,
		});
	}
};
