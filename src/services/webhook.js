const axios = require("axios");

exports.triggerWebhook = async (
	webhookUrl,
	requestId,
	csvUrl,
) => {
	const payload = {
		requestId,
		status : "completed",
		csvUrl,
		message : "Your images are successfully processed.",
	};

	try {
		await axios.post(webhookUrl, payload);
		console.log("Webhook triggered successfully: ", webhookUrl);
	} catch (error) {
		console.error("Failed to trigger webhook: ", error);
	}
};
