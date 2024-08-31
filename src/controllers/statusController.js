const Request = require("../models/request");

exports.checkStatus = async (req, res) => {
	const { requestId } = req.params;

	try {
		const request = await Request.findById(requestId);

		if (!request) {
			return res.status(404).json({ error: "Request not found" });
		}

		if (request.status === "completed") {
			return res.status(200).json({
                        csv_url: request.output_csv_url,
                        status: request.status,
                        requestId: requestId,
                        message: "Your images are successfully processed.",
                  });
		} else if (request.status === "failed") {
                  return res.status(500).json({
                        status: request.status,
                        requestId: requestId,
                  });
            }

		res.status(200).json({
			status: request.status,
			requestId: requestId,
			message: "Your images are currently being processed.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error checking status" });
	}
};
